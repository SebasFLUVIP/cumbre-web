import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getRawProductById, getSettings } from "@/lib/store";
import ProductForm from "@/components/admin/ProductForm";
import { deleteProduct, upsertProduct } from "../../actions";

export default async function EditarProducto({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const [product, settings] = await Promise.all([
    getRawProductById(id),
    getSettings(),
  ]);
  if (!product) notFound();

  return (
    <div className="shell py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/admin/productos"
          className="text-[0.68rem] uppercase tracking-[0.16em] text-mute link-underline"
        >
          ← Productos
        </Link>
        <Link
          href={`/producto/${product.slug}`}
          target="_blank"
          className="text-[0.68rem] uppercase tracking-[0.16em] text-mute link-underline"
        >
          Ver en la tienda ↗
        </Link>
      </div>
      <h1 className="display mt-4 text-[2.4rem]">{product.name}</h1>
      <ProductForm
        product={product}
        settings={settings}
        action={upsertProduct}
        onDelete={deleteProduct}
      />
    </div>
  );
}
