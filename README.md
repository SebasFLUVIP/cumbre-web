# Cumbre — Decoration & Interior Design

Sitio de Cumbre: tienda en línea de objetos y muebles, portafolio de proyectos
de interiorismo y captación de consultas para asesorías y obra.

Stack: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 ·
pasarela Wompi.

---

## Arrancar en local

```bash
npm install
cp .env.example .env.local   # y completá los valores
npm run dev
```

El sitio queda en <http://localhost:3000> y el panel en
<http://localhost:3000/admin>.

### Variables de entorno

| Variable | Para qué sirve |
| --- | --- |
| `NEXT_PUBLIC_WOMPI_PUBLIC_KEY` | Llave pública de Wompi. Viaja al navegador. |
| `WOMPI_INTEGRITY_SECRET` | Firma el monto del pedido. **Secreto.** |
| `WOMPI_EVENTS_SECRET` | Valida el webhook de Wompi. **Secreto.** |
| `NEXT_PUBLIC_SITE_URL` | URL pública. Define a dónde vuelve el cliente después de pagar. |
| `ADMIN_PASSWORD` | Contraseña del panel `/admin`. |
| `ADMIN_SESSION_SECRET` | Firma la cookie de sesión del panel. Cadena larga y aleatoria. |

Sin `ADMIN_PASSWORD` el panel queda cerrado. Sin las llaves de Wompi el
checkout muestra un aviso y no deja cobrar.

---

## Panel de administración

`/admin` — protegido con contraseña.

- **Productos.** Alta, edición y baja. Cada ficha guarda el **link del
  proveedor**, el **costo** (en USD o en COP) y el **margen**; con eso calcula
  el precio de venta. Ese bloque es interno: `toPublicProduct()` lo elimina en
  el servidor antes de que cualquier producto llegue al navegador, así que el
  link de compra nunca queda expuesto en el HTML ni en el bundle.
- **Pedidos.** Wompi marca aprobado o rechazado por webhook; «enviado» y
  «entregado» se marcan a mano.
- **Leads.** Consultas de proyecto con estado y exportación a CSV.
- **Ajustes.** TRM, margen por defecto, costos de envío y datos de contacto.
  El botón «Recalcular precios» reaplica TRM y margen a todo lo importado.

---

## Conectar Wompi

1. Crear el comercio en <https://comercios.wompi.co>.
2. Copiar las llaves (Ajustes → Llaves API) a `.env.local`. Empezá con las de
   sandbox: `pub_test_…` y `test_integrity_…`.
3. Registrar la URL de eventos en el panel de Wompi:
   `https://TU-DOMINIO/api/wompi/webhook`.
4. Probar un pago con las tarjetas de prueba de Wompi.
5. Cambiar a las llaves de producción cuando el comercio esté aprobado.

El monto se recalcula siempre en el servidor contra el catálogo: lo que manda
el navegador es qué producto y cuántos, nunca el precio.

---

## Imágenes

Las fotos originales viven en `_originales/` (fuera del build). El pipeline las
procesa a `public/img/`:

```bash
python3 -m venv .venv
./.venv/bin/pip install "rembg[cpu]" pillow pillow-heif
./.venv/bin/python scripts/process_images.py          # todo
./.venv/bin/python scripts/process_images.py studio   # solo fichas de producto
./.venv/bin/python scripts/process_images.py lifestyle # solo ambientes
```

- **studio** recorta el fondo con `rembg`, endurece la máscara, descarta motas
  sueltas y monta la pieza sobre un fondo de estudio con sombra de contacto.
- **lifestyle** aplica el grading cálido de la marca y genera tres encuadres
  (`-wide` 16:9, `-tall` 4:5, `-sq` 1:1). Los tamaños responsive los resuelve
  `next/image` en tiempo de request.

Para sumar una foto: dejala en `_originales/`, agregá su entrada a la lista
`LIFE` o `STUDIO` en `scripts/process_images.py` y corré el script. Después,
pegá la ruta resultante en el campo «Imágenes» de la ficha, en el admin.

---

## Catálogo

`data/catalog.json` es la fuente de verdad y la escribe el admin. El script
`scripts/seed-catalog.mjs` lo genera desde cero:

```bash
node scripts/seed-catalog.mjs   # OJO: sobrescribe data/catalog.json
```

Correlo solo para volver al estado inicial. Una vez que carguen productos desde
el panel, dejá de usarlo.

---

## Despliegue en Vercel + Supabase

En Vercel el sistema de archivos es de **solo lectura**, así que los JSON de
`/data` no sirven: el admin no podría guardar nada. Por eso el proyecto trae dos
backends y elige solo según el entorno (ver `src/lib/store.ts`):

| Entorno | Backend | Cuándo |
| --- | --- | --- |
| Local | Archivos JSON en `/data` | Si no hay variables de Supabase |
| Producción | Supabase (Postgres) | Si las hay |

No hay que cambiar código para pasar de uno al otro.

### 1. Crear la base en Supabase

1. Crear un proyecto en <https://supabase.com> (el plan gratis alcanza de sobra).
2. Abrir **SQL Editor → New query**, pegar todo `supabase/schema.sql` y darle Run.
3. Ir a **Project Settings → API** y copiar:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role** (no la `anon`) → `SUPABASE_SERVICE_ROLE_KEY`

> La `service_role` salta las políticas de seguridad de la base. Va solo en el
> servidor y **nunca** con prefijo `NEXT_PUBLIC_`. El esquema deja RLS activo y
> sin políticas, así que aunque se filtrara la llave anónima las tablas quedan
> cerradas.

### 2. Subir lo que ya existe

Con las dos variables en `.env.local`:

```bash
npm run migrate:supabase
```

Sube ajustes, catálogo, pedidos y consultas. Se puede correr varias veces sin
duplicar nada.

### 3. Desplegar

1. Subir el repo a GitHub e importarlo en Vercel (detecta Next.js solo).
2. Cargar en **Settings → Environment Variables** las mismas del
   `.env.example`: las dos de Supabase, las tres de Wompi, `NEXT_PUBLIC_SITE_URL`
   con el dominio real, `ADMIN_PASSWORD` y `ADMIN_SESSION_SECRET`.
3. Deploy.
4. En el panel de Wompi, registrar el webhook:
   `https://TU-DOMINIO/api/wompi/webhook`.

En **Ajustes** del admin se ve en todo momento de qué backend está leyendo el
sitio, para no desplegar por error contra los archivos.

### Qué queda en el repo y qué no

Las fotos procesadas viven en `public/img/` y se despliegan con el sitio (23 MB).
Los originales en `_originales/` están en `.gitignore`: pesan 62 MB y no hacen
falta en producción — guardalos aparte, en Drive o donde tengan el archivo.

## Pendientes conocidos

- **Costos de los importados.** Los valores en USD del catálogo inicial son
  estimados: hay que confirmarlos en Amazon y corregirlos en el admin antes de
  vender. El precio se recalcula solo al guardar.
- **Fotos de producto.** 37 de 46 productos usan la placa tipográfica de
  respaldo hasta que haya foto propia. Filtro «Sin foto» en el admin.
- **Aviso de leads.** Hoy las consultas quedan solo en el panel. Falta definir
  el canal (correo o WhatsApp Business API) y engancharlo en
  `src/app/api/leads/route.ts`.
- **Datos de contacto.** WhatsApp, correo e Instagram están con valores de
  ejemplo en Ajustes.
