"use client";

import { usePathname } from "next/navigation";

/**
 * Botón flotante de WhatsApp. En Colombia es el canal donde realmente se cierra
 * la conversación, así que va presente en toda la navegación pública —pero no
 * en el admin ni encima del checkout, donde estorbaría.
 */
export default function WhatsAppButton({ phone }: { phone: string }) {
  const pathname = usePathname();
  const hidden =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/pedido");
  if (hidden) return null;

  return (
    <a
      href={`https://wa.me/${phone}?text=${encodeURIComponent(
        "Hola Cumbre, quiero hacerles una consulta."
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribirnos por WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-espresso py-3.5 pl-4 pr-5 text-bone shadow-[0_8px_30px_rgba(44,38,30,0.28)] transition-colors hover:bg-ink"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="h-5 w-5 shrink-0 fill-current"
      >
        <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39a9.86 9.86 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.1.81.83-3.03-.2-.31a8.17 8.17 0 0 1-1.26-4.39c0-4.54 3.7-8.23 8.23-8.23a8.18 8.18 0 0 1 8.22 8.24c0 4.54-3.69 8.24-8.23 8.24Zm4.52-6.16c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.09-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.74 2.65 4.21 3.71.59.26 1.05.41 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
      </svg>
      <span className="text-[0.7rem] uppercase tracking-[0.16em]">WhatsApp</span>
    </a>
  );
}
