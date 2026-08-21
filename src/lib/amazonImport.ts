const CHROME_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

export type ScrapedAmazonProduct = {
  asin?: string;
  name: string;
  images: string[];
  costCOP?: number;
  costUSD?: number;
};

function cleanTitle(rawTitle: string): string {
  let title = rawTitle
    .replace(/^Amazon\.com\s*[:\-]\s*/i, "")
    .replace(/\s*[:\-]\s*Amazon\.com.*$/i, "")
    .trim();

  // Amazon suele agregar la categoría del breadcrumb al final, separada por
  // " : " (ej.: "... decoración rústica del hogar : Hogar y Cocina"). Un
  // segmento final corto casi nunca es parte del nombre real del producto.
  const parts = title.split(" : ");
  if (parts.length > 1 && parts[parts.length - 1].length < 40) {
    title = parts.slice(0, -1).join(" : ").trim();
  }

  return title;
}

/**
 * Las páginas de producto de Amazon repiten "class=\"a-offscreen\"" para el
 * precio del buybox, que siempre aparece antes que cualquier precio de
 * carruseles de "también compraron" más abajo en el HTML -- por eso basta con
 * el primer match que se pueda parsear como número.
 */
function parsePrice(text: string): { amount: number; currency: "COP" | "USD" } | null {
  const m = text.trim().match(/^([A-Za-z$]*)\s*([\d.,]+)$/);
  if (!m) return null;
  const amount = Number(m[2].replace(/,/g, ""));
  if (!Number.isFinite(amount) || amount <= 0) return null;
  const currency = /COP/i.test(m[1]) ? "COP" : "USD";
  return { amount, currency };
}

export async function scrapeAmazonProduct(url: string): Promise<ScrapedAmazonProduct> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": CHROME_UA,
      "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
    },
  });
  if (!res.ok) throw new Error(`Amazon respondió ${res.status}`);
  const html = await res.text();

  const asin = (url.match(/\/(?:dp|gp\/product|product)\/([A-Z0-9]{10})/i) ?? [])[1];

  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const name = titleMatch ? cleanTitle(titleMatch[1]) : "Producto importado de Amazon";

  const priceMatches = [...html.matchAll(/class="a-offscreen">([^<]*)</g)].map((m) => m[1]);
  let costCOP: number | undefined;
  let costUSD: number | undefined;
  for (const raw of priceMatches) {
    const parsed = parsePrice(raw);
    if (parsed) {
      if (parsed.currency === "COP") costCOP = Math.round(parsed.amount);
      else costUSD = parsed.amount;
      break;
    }
  }

  const imageMatches = [
    ...html.matchAll(/"hiRes":"(https:\/\/m\.media-amazon\.com\/images\/[^"]+)"/g),
  ].map((m) => m[1]);
  const images = Array.from(new Set(imageMatches)).slice(0, 8);

  return { asin, name, images, costCOP, costUSD };
}
