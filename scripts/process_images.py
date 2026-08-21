"""
Pipeline de edicion de imagenes de Cumbre.

Dos tratamientos:
  1. "studio"    -> recorte de fondo con rembg, sombra de contacto y fondo de
                    estudio degradado. Para fichas de producto.
  2. "lifestyle" -> color grading calido, encuadres y exportacion multi-ancho.
                    Para proyectos y cabeceras.
"""
import os, sys, math
from PIL import Image, ImageOps, ImageFilter, ImageEnhance, ImageDraw, ImageChops

try:
    import pillow_heif
    pillow_heif.register_heif_opener()
except Exception:
    pass

SRC = "_originales"
OUT_PROD = "public/img/productos"
OUT_PROJ = "public/img/proyectos"
OUT_BRAND = "public/img/marca"

# Fondo de estudio: hueso calido, mismo territorio que el logo.
BG_TOP = (244, 240, 232)
BG_BOTTOM = (231, 224, 212)


def load(name):
    im = Image.open(os.path.join(SRC, name))
    im = ImageOps.exif_transpose(im)
    return im.convert("RGBA") if im.mode in ("RGBA", "LA", "P") else im.convert("RGB")


def warm_grade(im, strength=1.0):
    """Grading muy contenido. strength=0 devuelve la imagen tal cual; los valores
    que usamos (0.2-0.3) solo empatan el tono entre fotos de distintas camaras
    sin que se note que hubo edicion."""
    im = im.convert("RGB")
    if strength <= 0:
        return im

    r, g, b = im.split()

    def curve(ch, lift, gain):
        # Tanto el lift como la ganancia se escalan: con strength=0 la curva
        # tiene que ser la identidad exacta, no un gain residual.
        eff_gain = 1.0 + (gain - 1.0) * strength
        eff_lift = lift * strength
        lut = [min(255, max(0, int(eff_lift + i * eff_gain))) for i in range(256)]
        return ch.point(lut)

    r = curve(r, 3, 1.010)
    g = curve(g, 1, 1.002)
    b = curve(b, -1, 0.992)
    im = Image.merge("RGB", (r, g, b))

    # Curva S apenas perceptible, solo para que el webp no se vea lavado.
    lut = []
    for i in range(256):
        x = i / 255.0
        y = x - strength * 0.05 * math.sin(2 * math.pi * x)
        lut.append(int(min(1.0, max(0.0, y)) * 255))
    im = im.point(lut * 3)

    im = ImageEnhance.Color(im).enhance(1.0 + 0.02 * strength)
    im = ImageEnhance.Contrast(im).enhance(1.0 + 0.02 * strength)
    return im


def neutralize(im, strength=1.0):
    """Corrige la dominante de color. Toma como referencia de blanco el promedio
    del 2% de píxeles más claros y escala cada canal para llevarlo a neutro.
    Sirve para las fotos tomadas con luz cálida o con filtro, que llegan naranjas."""
    if strength <= 0:
        return im
    im = im.convert("RGB")
    small = im.resize((160, max(1, int(160 * im.height / im.width))), Image.BILINEAR)
    px = list(small.getdata())
    px.sort(key=lambda p: p[0] + p[1] + p[2], reverse=True)
    top = px[: max(1, len(px) // 50)]
    n = len(top)
    wp = [sum(p[c] for p in top) / n for c in range(3)]
    target = sum(wp) / 3
    out = []
    for c in range(3):
        gain = 1.0 + (target / max(1.0, wp[c]) - 1.0) * strength
        out.append(im.getchannel("RGB"[c]).point(
            lambda v, g=gain: min(255, max(0, int(v * g)))))
    return Image.merge("RGB", out)



def cool_down(im, amt=0.0, sat=1.0):
    """Baja el rojo y sube el azul. El balance de blancos por sí solo no alcanza
    cuando la escena entera es de muros beige bajo luz cálida: ahí hay que
    enfriar de verdad. `sat` compensa el exceso de color que queda."""
    im = im.convert("RGB")
    if amt > 0:
        r, g, b = im.split()
        r = r.point(lambda v: max(0, int(v * (1 - 0.06 * amt))))
        b = b.point(lambda v: min(255, int(v * (1 + 0.09 * amt))))
        im = Image.merge("RGB", (r, g, b))
    if sat != 1.0:
        im = ImageEnhance.Color(im).enhance(sat)
    return im



def unsharp(im, amount=0.35):
    return im.filter(ImageFilter.UnsharpMask(radius=1.6, percent=int(amount * 100), threshold=3))


def studio_bg(size):
    w, h = size
    grad = Image.new("RGB", (1, h))
    for y in range(h):
        t = y / max(1, h - 1)
        # easing para que el degradado no se vea lineal/plano
        t = t * t * (3 - 2 * t)
        grad.putpixel((0, y), tuple(
            int(BG_TOP[i] + (BG_BOTTOM[i] - BG_TOP[i]) * t) for i in range(3)))
    bg = grad.resize((w, h))
    # luz suave detras del objeto
    glow = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(glow)
    cx, cy, rx, ry = w * 0.5, h * 0.42, w * 0.46, h * 0.40
    d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=70)
    glow = glow.filter(ImageFilter.GaussianBlur(int(min(w, h) * 0.16)))
    white = Image.new("RGB", (w, h), (255, 253, 249))
    return Image.composite(white, bg, glow.point(lambda v: int(v * 0.55)))


def keep_main_blobs(alpha, min_ratio=0.04):
    """rembg suele dejar motas sueltas lejos del objeto. Etiquetamos las
    componentes conexas sobre una version reducida de la mascara y descartamos
    las que no llegan al min_ratio del area de la mas grande."""
    w, h = alpha.size
    sw = 360
    sh = max(1, int(h * sw / w))
    small = alpha.resize((sw, sh), Image.BILINEAR).point(lambda v: 255 if v > 40 else 0)
    px = small.load()

    labels = [[0] * sw for _ in range(sh)]
    sizes = {}
    cur = 0
    for y0 in range(sh):
        for x0 in range(sw):
            if px[x0, y0] == 0 or labels[y0][x0]:
                continue
            cur += 1
            stack = [(x0, y0)]
            labels[y0][x0] = cur
            n = 0
            while stack:
                x, y = stack.pop()
                n += 1
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < sw and 0 <= ny < sh and not labels[ny][nx] and px[nx, ny]:
                        labels[ny][nx] = cur
                        stack.append((nx, ny))
            sizes[cur] = n

    if not sizes:
        return alpha
    biggest = max(sizes.values())
    keep = {k for k, v in sizes.items() if v >= biggest * min_ratio}

    mask = Image.new("L", (sw, sh), 0)
    mp = mask.load()
    for y in range(sh):
        for x in range(sw):
            if labels[y][x] in keep:
                mp[x, y] = 255
    mask = mask.resize((w, h), Image.BILINEAR).filter(ImageFilter.GaussianBlur(1.5))
    mask = mask.point(lambda v: 255 if v > 90 else 0)
    return ImageChops.multiply(alpha, mask)


def harden_alpha(a, lo=45, hi=185):
    """La mascara cruda de rembg deja medios tonos en todo el cuerpo del objeto,
    lo que lo vuelve semitransparente sobre el fondo. Empujamos los medios a
    opaco y dejamos la rampa solo en el borde real."""
    lut = []
    for v in range(256):
        if v <= lo:
            lut.append(0)
        elif v >= hi:
            lut.append(255)
        else:
            t = (v - lo) / (hi - lo)
            lut.append(int(255 * (t * t * (3 - 2 * t))))
    a = a.point(lut)
    return a.filter(ImageFilter.GaussianBlur(0.6))


def drop_shadow(alpha, canvas_size, offset, blur, opacity):
    """Sombra proyectada a partir de la silueta. Para piezas de pared."""
    w, h = canvas_size
    sh = Image.new("L", (w, h), 0)
    sh.paste(alpha, offset)
    sh = sh.filter(ImageFilter.GaussianBlur(blur))
    return sh.point(lambda v: int(v * opacity))


def contact_shadow(alpha, canvas_size, obj_box):
    """Sombra elipsoidal difusa bajo el objeto, tomando su ancho real."""
    w, h = canvas_size
    x0, y0, x1, y1 = obj_box
    ow = x1 - x0
    sw = int(ow * 0.86)
    sh = max(8, int(sw * 0.13))
    shadow = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(shadow)
    cx = (x0 + x1) // 2
    cy = y1 - int(sh * 0.25)
    d.ellipse([cx - sw // 2, cy - sh // 2, cx + sw // 2, cy + sh // 2], fill=115)
    shadow = shadow.filter(ImageFilter.GaussianBlur(max(6, sh // 2)))
    return shadow


def to_studio(name, out_name, target=(1600, 2000), margin=0.12, rotate=0,
              grounded=True, model="isnet-general-use", precrop=None,
              mask_out=None):
    """grounded=True  -> pieza de piso: se apoya abajo y lleva sombra de contacto.
       grounded=False -> pieza de pared o colgante: centrada, con sombra proyectada."""
    from rembg import remove, new_session
    global _SESSIONS
    try:
        _SESSIONS
    except NameError:
        _SESSIONS = {}
    if model not in _SESSIONS:
        _SESSIONS[model] = new_session(model)

    im = load(name)
    if rotate:
        im = im.rotate(rotate, expand=True)
    if precrop:
        w, h = im.size
        l, t, r, b = precrop
        im = im.crop((int(w * l), int(h * t), int(w * r), int(h * b)))
    im = im.convert("RGB")

    cut = remove(im, session=_SESSIONS[model], alpha_matting=False,
                 post_process_mask=True).convert("RGBA")
    a = harden_alpha(cut.getchannel("A"))
    if mask_out:
        # Borra zonas del encuadre donde quedaron objetos del ambiente que no
        # son la pieza (jarrones, bandejas, muebles de apoyo).
        d = ImageDraw.Draw(a)
        aw, ah = a.size
        for l, t, r, b in mask_out:
            d.rectangle([int(aw * l), int(ah * t), int(aw * r), int(ah * b)], fill=0)
    a = keep_main_blobs(a)
    cut = Image.merge("RGBA", (*cut.convert("RGB").split(), a))

    bbox = a.point(lambda v: 255 if v > 10 else 0).getbbox()
    if bbox:
        cut = cut.crop(bbox)

    tw, th = target
    avail_w, avail_h = int(tw * (1 - 2 * margin)), int(th * (1 - 2 * margin))
    scale = min(avail_w / cut.width, avail_h / cut.height)
    cut = cut.resize((max(1, int(cut.width * scale)), max(1, int(cut.height * scale))),
                     Image.LANCZOS)

    rgb = warm_grade(cut.convert("RGB"), 0.3)
    rgb = unsharp(rgb, 0.3)
    cut = Image.merge("RGBA", (*rgb.split(), cut.getchannel("A")))

    canvas = studio_bg(target)
    ox = (tw - cut.width) // 2
    oy = int(th * 0.90) - cut.height if grounded else (th - cut.height) // 2
    oy = max(int(th * margin * 0.5), oy)

    if grounded:
        sh = contact_shadow(cut.getchannel("A"), target,
                            (ox, oy, ox + cut.width, oy + cut.height))
        tint = (156, 143, 126)
    else:
        sh = drop_shadow(cut.getchannel("A"), target,
                         (ox + int(tw * 0.012), oy + int(th * 0.016)),
                         blur=int(min(tw, th) * 0.022), opacity=0.30)
        tint = (168, 156, 140)

    canvas = Image.composite(Image.new("RGB", target, tint), canvas, sh)
    canvas.paste(cut, (ox, oy), cut)

    path = os.path.join(OUT_PROD, out_name + ".webp")
    canvas.save(path, "WEBP", quality=90, method=6)
    canvas.resize((tw // 2, th // 2), Image.LANCZOS).save(
        os.path.join(OUT_PROD, out_name + "-sm.webp"), "WEBP", quality=88, method=6)
    print("studio  ->", path, canvas.size)


def crop_to(im, ratio):
    w, h = im.size
    target = ratio
    cur = w / h
    if cur > target:
        nw = int(h * target)
        return im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    nh = int(w / target)
    top = int((h - nh) * 0.42)  # encuadre ligeramente alto, mas natural en interiores
    return im.crop((0, top, w, top + nh))


def to_lifestyle(name, out_name, ratios=None, outdir=None, max_w=2400,
                 strength=0.25, neutral=0.0, cool=0.0, sat=1.0):
    """Un archivo por encuadre, a la mayor resolucion util. Los tamanos
    responsive los genera next/image en tiempo de request."""
    outdir = outdir or OUT_PROJ
    ratios = ratios or {"": None}
    im = cool_down(neutralize(warm_grade(load(name), strength), neutral), cool, sat)
    for suffix, ratio in ratios.items():
        base = crop_to(im, ratio) if ratio else im
        if base.width > max_w:
            base = base.resize((max_w, int(base.height * max_w / base.width)),
                               Image.LANCZOS)
        out = unsharp(base, 0.2)
        fn = f"{out_name}{suffix}.webp"
        out.save(os.path.join(outdir, fn), "WEBP", quality=88, method=6)
        print("lifestyle ->", fn, out.size)


def to_crop(name, out_name, box, size=None, outdir=None, strength=0.25,
            neutral=0.0, cool=0.0, sat=1.0):
    """Recorte explícito en fracciones (l, t, r, b). Se usa para encuadres
    puntuales, como el avatar redondo de las fundadoras, donde el recorte
    automático deja las caras demasiado chicas."""
    outdir = outdir or OUT_PROJ
    im = cool_down(neutralize(warm_grade(load(name), strength), neutral), cool, sat)
    w, h = im.size
    l, t, r, b = box
    im = im.crop((int(w * l), int(h * t), int(w * r), int(h * b)))
    if size:
        im = im.resize(size, Image.LANCZOS)
    im = unsharp(im, 0.2)
    im.save(os.path.join(outdir, out_name + ".webp"), "WEBP", quality=90, method=6)
    print("crop      ->", out_name, im.size)



if __name__ == "__main__":
    which = sys.argv[1] if len(sys.argv) > 1 else "all"
    R = {"-wide": 16 / 9, "-tall": 4 / 5, "-sq": 1.0}

    if which in ("all", "lifestyle"):
        LIFE = [
            ("principalcumbre.png", "cumbre-principal"),
            ("04D7ECD5-DA7A-4F7B-AEBC-4E70BDDFCFE2.PNG", "anapoima-comedor"),
            ("B49AE1CE-992A-4255-8229-811B7A7E46EC.PNG", "anapoima-terraza"),
            ("901A5C77-1FC7-4B0B-B142-6CC71CBE1AC1.PNG", "anapoima-piscina-dia"),
            ("78663ABF-20D0-4908-825A-DD51249A6C10.jpg", "anapoima-piscina-vertical"),
            ("20EBAC0F-E06D-4B51-9EF4-DD37CE8800DF.jpg", "anapoima-social"),
            ("83250BBC-A87C-4069-AC1E-CD01C0ED1D60.jpg", "anapoima-bano"),
            ("3e50f997-b205-4050-88a0-5e50f09db653.avif", "anapoima-habitacion"),
            ("4381AFF7-5083-43A4-A411-07F5DA6DE517.PNG", "faroles-piscina"),
            ("_ (21).jpeg", "perchero-ambiente"),
            ("_ (30).jpeg", "poufs-exterior"),
            ("_ (31).jpeg", "asoleadoras-exterior"),
        ]
        for src, out in LIFE:
            to_lifestyle(src, out, ratios=R)

        # Referencias de estilo. Vienen a 736 px de ancho, así que solo se
        # generan los encuadres que no obligan a ampliar: vertical y cuadrado.
        # Un 16:9 sacado de acá quedaría en 736x414 y se vería blando.
        MOOD = [
            "estilo-entrada",
            "estilo-espejo-arco",
            "estilo-espejo-sala",
            "estilo-sala-modular",
            "estilo-sala-travertino",
            "estilo-repisas",
            "estilo-estudio",
        ]
        for name in MOOD:
            to_lifestyle(f"{name}.jpeg", name, ratios={"-tall": 4 / 5, "-sq": 1.0})

        # Fotos nuevas en alta. Las de 1536 px aguantan encuadre ancho.
        NUEVAS = [
            "estilo-comedor-lamparas",
            "estilo-comedor-lamparas-vert",
            "estilo-sala-lino",
            "estilo-cocina-faroles",
            "estilo-sala-listones",
            "estilo-estudio-olivo",
        ]
        for name in NUEVAS:
            to_lifestyle(f"{name}.png", name, ratios=R)

        # Material del feed de Instagram de Cumbre: producto y ambiente reales.
        IG_AMBIENTE = [
            ("ig11", "jarron-ceramica-ambiente"),
            ("ig20", "espejo-arco-negro"),
            ("ig13", "espejo-redondo-negro"),
            ("ig30", "espejo-sol-terraza"),
            ("ig10", "espejo-sol-habitacion"),
            ("ig27", "mesa-noche-roble"),
            ("ig37", "mesa-noche-ambiente"),
            ("ig23", "comedor-ovalado"),
            ("ig09", "mesa-madera-maciza"),
            ("ig03", "consola-madera"),
            ("ig05", "espaldar-lino"),
            ("ig08", "comedor-sillas-tapizadas"),
            ("ig02", "silla-colgante"),
            ("ig41", "asoleadora-piscina"),
            ("ig22", "lamparas-esferas-cocina"),
            ("ig34", "sala-sillas-rayas"),
            ("ig04", "apto-bogota-styling"),
            ("ig26", "banqueta-junco-ambiente"),
            ("ig32", "lamparas-flecos-bano"),
            ("ig33", "lamparas-barra"),
        ]
        # Toma en alta del mismo apartamento de Bogotá.
        to_lifestyle("apto-bogota-mesas.png", "apto-bogota-mesas", ratios=R,
                     strength=0, neutral=1.0, cool=0.8, sat=0.9)

        for src_f, out in IG_AMBIENTE:
            to_lifestyle(f"ig/{src_f}.jpg", out, ratios=R,
                         strength=0, neutral=1.0, cool=0.8, sat=0.9)

        # Sala con chimenea: reemplaza a anapoima-bano en la franja editorial
        # de la home, que se veia pixelada a ancho completo de pantalla.
        to_lifestyle('sala-chimenea.jpg', 'sala-chimenea', ratios=R)

        # El retrato va sin grading de marca, pero sí con balance de blancos:
        # la toma se hizo con luz de tarde sobre muros crema y el archivo sale
        # con una dominante ámbar que tiñe las camisas blancas.
        to_lifestyle("nosotras3.png", "tita-y-vicky", ratios=R,
                     strength=0, neutral=1.0, cool=1.0, sat=0.85)
        to_crop("nosotras3.png", "tita-y-vicky-avatar",
                (0.28, 0.14, 0.68, 0.74), size=(512, 512),
                strength=0, neutral=1.0, cool=1.0, sat=0.85)

    if which in ("all", "studio"):
        STUDIO = [
            # (archivo, salida, rotacion, apoyado en el piso)
            ("IMG_5943.HEIC", "lampara-fique-borlas", 0, False),
            ("_ (22).jpeg", "perchero-roble", 0, True),
            ("_ (23).jpeg", "perchero-rattan", 0, True),
            ("_ (27).jpeg", "aplique-geometrico", 0, False),
            ("_ (28).jpeg", "aplique-rejilla", 0, False),
            # La foto original incluye una consola con licorera al pie del
            # mural; se recorta antes del cutout para que no viaje a la ficha.
            ("_ (29).jpeg", "aplique-mural-xl", 0, False, (0.06, 0.0, 1.0, 0.78),
             [(0.05, 0.68, 0.27, 1.0)]),
        ]
        STUDIO += [
            # Piezas del feed que están sobre fondo limpio y aguantan recorte.
            ("ig/ig19.jpg", "banqueta-junco", 0, True),
            ("ig/ig36.jpg", "lampara-yute-dos", 0, False),
            ("ig/ig42.jpg", "lampara-flecos-marfil", 0, False),
            ("ig/ig31.jpg", "ganchos-madera", 0, False),
            ("ig/ig17.jpg", "toallero-madera", 0, False),
            ("ig/ig29.jpg", "cuadro-textura", 0, False),
        ]
        model = os.environ.get("REMBG_MODEL", "isnet-general-use")
        for entry in STUDIO:
            src_f, out, rot, grounded = entry[:4]
            precrop = entry[4] if len(entry) > 4 else None
            mask_out = entry[5] if len(entry) > 5 else None
            to_studio(src_f, out, rotate=rot, grounded=grounded, model=model,
                      precrop=precrop, mask_out=mask_out)
