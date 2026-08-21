import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/store";
import ProductForm from "@/components/admin/ProductForm";
import { upsertProduct } from "../../actions";

export default async function NuevoProducto() {
  await requireAdmin();
  const settings = await getSettings();

  return (
    <div className="shell py-12">
      <Link
        href="/admin/productos"
        className="text-[0.68rem] uppercase tracking-[0.16em] text-mute link-underline"
      >
        ← Productos
      </Link>
      <h1 className="display mt-4 text-[2.4rem]">Nuevo producto</h1>
      <ProductForm settings={settings} action={upsertProduct} />
    </div>
  );
}
