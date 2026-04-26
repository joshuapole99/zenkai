#!/usr/bin/env python3
"""Zenkai — Anime Sensei Minimalism — 7 museum-quality PNG assets."""

from PIL import Image, ImageDraw, ImageFilter, ImageFont
import math, os, random

random.seed(42)

FONTS = r"C:\Users\joshu\Zenkai\.claude\skills\canvas-design\canvas-fonts"
OUT   = r"C:\Users\joshu\Zenkai\public\images"
os.makedirs(OUT, exist_ok=True)

# ── Palette ──────────────────────────────────────────────────────────────────
BG    = (10,  10,  10)
ORG   = (255, 107,  53)
PRP   = (124,  58, 237)
GOLD  = (255, 215,   0)
LPRP  = (180, 140, 255)
WHITE = (255, 255, 255)
BLACK = (  0,   0,   0)

def ck(r, g=0, b=0, a=255):
    if isinstance(r, (tuple, list)):
        vals = list(r) + [255]
        return tuple(max(0, min(255, int(v))) for v in vals[:4])
    return (max(0,min(255,int(r))), max(0,min(255,int(g))),
            max(0,min(255,int(b))), max(0,min(255,int(a))))

def font(name, size):
    try:    return ImageFont.truetype(os.path.join(FONTS, name), size)
    except: return ImageFont.load_default()

def textw(draw, text, fnt):
    try:    return draw.textlength(text, font=fnt)
    except: return fnt.getlength(text) if hasattr(fnt, 'getlength') else len(text) * size // 2

# ── Glow / energy helpers ────────────────────────────────────────────────────

def glow(img, cx, cy, radius, color, alpha=140, blur=40):
    g = Image.new("RGBA", img.size, (0,0,0,0))
    ImageDraw.Draw(g).ellipse(
        [cx-radius, cy-radius, cx+radius, cy+radius],
        fill=(*color, alpha))
    return Image.alpha_composite(img, g.filter(ImageFilter.GaussianBlur(blur)))

def glows(img, cx, cy, layers):          # layers = [(r, col, a, blur), ...]
    for r, col, a, b in layers:
        img = glow(img, cx, cy, r, col, a, b)
    return img

def burst(w, h, cx, cy, n, color, r_near, r_far, alpha=80, seed=0):
    rng = random.Random(seed)
    lay = Image.new("RGBA", (w, h), (0,0,0,0))
    d   = ImageDraw.Draw(lay)
    for i in range(n):
        ang = (i / n) * 2 * math.pi + rng.uniform(-0.25, 0.25)
        r1  = rng.uniform(r_near * 0.8, r_near * 1.4)
        r2  = rng.uniform(r_far  * 0.65, r_far)
        alp = rng.randint(int(alpha * 0.4), alpha)
        wid = rng.randint(1, 3)
        d.line([(cx + math.cos(ang)*r1, cy + math.sin(ang)*r1),
                (cx + math.cos(ang)*r2, cy + math.sin(ang)*r2)],
               fill=(*color, alp), width=wid)
    return lay.filter(ImageFilter.GaussianBlur(1.5))

def grid_overlay(w, h, step, color, alpha):
    lay = Image.new("RGBA", (w, h), (0,0,0,0))
    d   = ImageDraw.Draw(lay)
    for x in range(0, w, step):
        d.line([(x,0),(x,h)], fill=(*color, alpha), width=1)
    for y in range(0, h, step):
        d.line([(0,y),(w,y)], fill=(*color, alpha), width=1)
    return lay

def scanlines(w, h, alpha=12):
    lay = Image.new("RGBA", (w, h), (0,0,0,0))
    d   = ImageDraw.Draw(lay)
    for y in range(0, h, 3):
        d.line([(0,y),(w,y)], fill=(0,0,0,alpha), width=1)
    return lay

def vignette(w, h, steps=80, max_alpha=100):
    lay = Image.new("RGBA", (w, h), (0,0,0,0))
    d   = ImageDraw.Draw(lay)
    for i in range(steps):
        a = int((1 - i/steps) * max_alpha)
        d.rectangle([i, i, w-i, h-i], outline=(0,0,0,a))
    return lay

# ── Silhouette engine ────────────────────────────────────────────────────────

def silhouette(img, cx, cy, s, fill, pose):
    """Draw a human figure silhouette. s = scale in pixels."""
    d  = ImageDraw.Draw(img)
    fc = (*fill[:3], fill[3] if len(fill)==4 else 255)

    def poly(*pts):
        d.polygon([(int(px), int(py)) for px,py in pts], fill=fc)

    def circ(x, y, r):
        d.ellipse([int(x-r), int(y-r), int(x+r), int(y+r)], fill=fc)

    # ── head (all poses)
    circ(cx, cy - s*0.42, s*0.105)

    if pose == 'punch':
        # torso — slight forward lean
        poly((cx-s*.14, cy-s*.29), (cx+s*.12, cy-s*.31),
             (cx+s*.12, cy+s*.06), (cx-s*.13, cy+s*.06))
        # right arm raised-forward punch
        poly((cx+s*.10, cy-s*.29), (cx+s*.43, cy-s*.57),
             (cx+s*.49, cy-s*.49), (cx+s*.16, cy-s*.22))
        circ(cx+s*.44, cy-s*.57, s*0.078)          # fist
        # left arm (guard, slightly forward)
        poly((cx-s*.14, cy-s*.29), (cx-s*.23, cy-.04*s),
             (cx-s*.17, cy+s*.02), (cx-s*.08, cy-s*.25))
        # legs — combat stance
        poly((cx-s*.01, cy+s*.06), (cx-s*.14, cy+s*.06),
             (cx-s*.17, cy+s*.44), (cx-s*.04, cy+s*.44))
        poly((cx+s*.01, cy+s*.06), (cx+s*.13, cy+s*.06),
             (cx+s*.10, cy+s*.44), (cx-s*.03, cy+s*.44))

    elif pose == 'rise':
        # torso
        poly((cx-s*.12, cy-s*.28), (cx+s*.12, cy-s*.28),
             (cx+s*.10, cy+s*.06), (cx-s*.10, cy+s*.06))
        # both arms raised in triumph
        poly((cx-s*.12, cy-s*.28), (cx-s*.34, cy-s*.54),
             (cx-s*.41, cy-s*.48), (cx-s*.19, cy-s*.23))
        circ(cx-s*.37, cy-s*.54, s*0.072)
        poly((cx+s*.12, cy-s*.28), (cx+s*.34, cy-s*.54),
             (cx+s*.41, cy-s*.48), (cx+s*.19, cy-s*.23))
        circ(cx+s*.37, cy-s*.54, s*0.072)
        # legs
        poly((cx-s*.01, cy+s*.06), (cx-s*.12, cy+s*.06),
             (cx-s*.10, cy+s*.44), (cx+s*.01, cy+s*.44))
        poly((cx+s*.01, cy+s*.06), (cx+s*.12, cy+s*.06),
             (cx+s*.10, cy+s*.44), (cx+s*.00, cy+s*.44))

    elif pose == 'stand_firm':
        # torso — wide, rooted
        poly((cx-s*.16, cy-s*.28), (cx+s*.16, cy-s*.28),
             (cx+s*.12, cy+s*.06), (cx-s*.12, cy+s*.06))
        # arms crossed over chest
        poly((cx-s*.16, cy-s*.24), (cx+s*.13, cy-s*.14),
             (cx+s*.10, cy-s*.08), (cx-s*.19, cy-s*.18))
        poly((cx+s*.16, cy-s*.24), (cx-s*.13, cy-s*.11),
             (cx-s*.10, cy-s*.05), (cx+s*.19, cy-s*.18))
        # legs wide, immovable
        poly((cx-s*.01, cy+s*.06), (cx-s*.15, cy+s*.06),
             (cx-s*.15, cy+s*.44), (cx-s*.01, cy+s*.44))
        poly((cx+s*.01, cy+s*.06), (cx+s*.15, cy+s*.06),
             (cx+s*.15, cy+s*.44), (cx+s*.01, cy+s*.44))

    elif pose == 'stride':
        # torso — slight forward tilt
        poly((cx-s*.11, cy-s*.27), (cx+s*.13, cy-s*.25),
             (cx+s*.11, cy+s*.06), (cx-s*.09, cy+s*.05))
        # one arm forward, one back (striding)
        poly((cx+s*.13, cy-s*.25), (cx+s*.24, cy-s*.07),
             (cx+s*.19, cy-s*.03), (cx+s*.08, cy-s*.21))
        poly((cx-s*.11, cy-s*.27), (cx-s*.26, cy-s*.06),
             (cx-s*.21, cy-s*.02), (cx-s*.06, cy-s*.23))
        # stride legs — one forward, one back
        poly((cx-s*.01, cy+s*.06), (cx-s*.13, cy+s*.06),
             (cx-s*.04, cy+s*.44), (cx+s*.07, cy+s*.44))
        poly((cx+s*.01, cy+s*.06), (cx+s*.13, cy+s*.06),
             (cx+s*.23, cy+s*.44), (cx+s*.13, cy+s*.44))

    elif pose == 'meditate':
        # torso upright
        poly((cx-s*.13, cy-s*.25), (cx+s*.13, cy-s*.25),
             (cx+s*.11, cy+s*.01), (cx-s*.11, cy+s*.01))
        # arms resting on knees
        poly((cx+s*.11, cy-s*.18), (cx+s*.27, cy-.01*s),
             (cx+s*.22, cy+s*.04), (cx+s*.07, cy-s*.14))
        poly((cx-s*.11, cy-s*.18), (cx-s*.27, cy-.01*s),
             (cx-s*.22, cy+s*.04), (cx-s*.07, cy-s*.14))
        # cross-legged base
        d.ellipse([int(cx-s*.29), int(cy), int(cx+s*.29), int(cy+s*.26)], fill=fc)

    return img

# ══════════════════════════════════════════════════════════════════════════════
# IMAGE 1 — hero-landing.png  1920×1080
# ══════════════════════════════════════════════════════════════════════════════

def make_hero():
    W, H = 1920, 1080
    img  = Image.new("RGBA", (W, H), (*BG, 255))

    fx, fy = int(W * 0.62), H // 2          # figure / glow focus

    # Deep atmospheric glow
    img = glows(img, fx, fy, [
        (700, PRP,   25, 180),
        (400, PRP,   40, 120),
        (280, ORG,   55,  80),
        (130, GOLD,  80,  40),
        ( 55, WHITE, 55,  18),
    ])
    # Secondary moody glow left (negative space breathing room)
    img = glow(img, W//5, H//2, 350, PRP, 18, 140)

    # Energy lines — orange and gold
    for seed in range(3):
        img = Image.alpha_composite(
            img, burst(W, H, fx, fy, 70, ORG,  130, 720, 55, seed*7))
    img = Image.alpha_composite(
        img, burst(W, H, fx, fy, 35, GOLD, 90, 500, 75, 21))

    # Silhouette — tall, cinematic
    scale = int(H * 0.68)
    img = silhouette(img, fx, fy + int(H*0.04), scale, (*BLACK, 255), 'punch')

    # Fist inner light
    fist_x = int(fx + scale * 0.44)
    fist_y = int(fy + H*0.04 - scale * 0.57)
    img = glow(img, fist_x, fist_y, 55, GOLD, 160, 22)
    img = glow(img, fist_x, fist_y, 28, WHITE, 100, 10)

    # Grid
    img = Image.alpha_composite(img, grid_overlay(W, H, 80, ORG, 5))
    # Scanlines
    img = Image.alpha_composite(img, scanlines(W, H, 14))

    # Typography
    f_title = font("BigShoulders-Bold.ttf",  148)
    f_mono  = font("GeistMono-Regular.ttf",   26)
    f_sub   = font("InstrumentSans-Regular.ttf", 30)
    dt      = ImageDraw.Draw(img)

    # "ZENKAI" — left side, massive
    dt.text((96, H//2 - 90), "ZENKAI",
            fill=(*WHITE, 210), font=f_title)
    # Underline accent
    title_w = int(textw(dt, "ZENKAI", f_title))
    dt.line([(96, H//2 + 72), (96 + title_w, H//2 + 72)],
            fill=(*ORG, 180), width=3)
    # Tagline
    dt.text((98, H//2 + 90), "Every comeback makes you stronger.",
            fill=(*ORG, 170), font=f_sub)
    # System label bottom-right
    sys_txt = "POWER SYSTEM ACTIVE"
    sw = int(textw(dt, sys_txt, f_mono))
    dt.text((W - sw - 48, H - 48), sys_txt,
            fill=(*PRP, 120), font=f_mono)

    # Vignette
    img = Image.alpha_composite(img, vignette(W, H, 80, 110))

    img.convert("RGB").save(os.path.join(OUT, "hero-landing.png"), "PNG")
    print("✓  hero-landing.png")

# ══════════════════════════════════════════════════════════════════════════════
# IMAGE 2 — master-kael-avatar.png  400×400  transparent
# ══════════════════════════════════════════════════════════════════════════════

def make_kael():
    W, H = 400, 400
    img  = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d    = ImageDraw.Draw(img)
    cx, cy = W // 2, 220                     # portrait center

    # ── Aura ──
    img = glow(img, cx, cy - 30, 160, PRP, 28, 65)
    img = glow(img, cx, cy - 60, 100, ORG,  22, 42)
    d   = ImageDraw.Draw(img)                # refresh after composite

    # ── Gi / body ──
    gi   = ck(22, 22, 32, 255)
    skin = ck(198, 168, 138, 255)
    hair = ck(145, 142, 155, 255)

    # Shoulders + torso
    d.polygon([(cx-82, cy-52), (cx+82, cy-52),
               (cx+72, cy+122), (cx-72, cy+122)], fill=gi)

    # Gi lapels (V collar)
    d.polygon([(cx-4, cy-52), (cx+28, cy-22),
               (cx+12, cy+68), (cx-4,  cy+46)], fill=ck(14,14,24,255))
    d.polygon([(cx+4,  cy-52), (cx-28, cy-22),
               (cx-12, cy+68), (cx+4,  cy+46)], fill=ck(14,14,24,255))

    # Belt
    d.rectangle([cx-72, cy+50, cx+72, cy+64], fill=ck(*ORG, 200))

    # Neck
    d.rectangle([cx-15, cy-72, cx+15, cy-50], fill=skin)

    # ── Head ──
    d.ellipse([cx-46, cy-136, cx+46, cy-64], fill=skin)

    # Hair — short, swept back, graying
    d.ellipse([cx-47, cy-140, cx+47, cy-88],  fill=hair)
    d.ellipse([cx-43, cy-138, cx+43, cy-104], fill=hair)
    # Clean hairline at forehead
    d.polygon([(cx-46, cy-112), (cx-22, cy-92),
               (cx+22, cy-92),  (cx+46, cy-112)], fill=skin)

    eye_y = cy - 107

    # ── Eyes — calm, intense ──
    for sign, ex in [(-1, cx-19), (1, cx+9)]:
        d.ellipse([ex-1, eye_y-7, ex+15, eye_y+5], fill=ck(30,30,50,255))
        d.ellipse([ex+1, eye_y-5, ex+13, eye_y+3], fill=ck(55,75,120,255))
        d.ellipse([ex+4, eye_y-3, ex+9,  eye_y+1], fill=ck(215,218,235,255))

    # ── Eyebrows — strong, slightly angled ──
    br = ck(95, 90, 100, 255)
    d.polygon([(cx-30, eye_y-13), (cx-8,  eye_y-11),
               (cx-8,  eye_y-7),  (cx-30, eye_y-9)],  fill=br)
    d.polygon([(cx+8,  eye_y-11), (cx+30, eye_y-13),
               (cx+30, eye_y-9),  (cx+8,  eye_y-7)],  fill=br)

    # ── Nose ──
    ny = cy - 90
    d.polygon([(cx-5, ny-8), (cx+5, ny-8),
               (cx+9, ny+3), (cx+5, ny+5),
               (cx-5, ny+5), (cx-9, ny+3)], fill=ck(168,138,112,255))

    # ── Mouth — slight knowing smile ──
    my = cy - 77
    d.arc([cx-16, my-3, cx+16, my+6], 5, 175, fill=ck(138,98,78,255), width=2)

    # ── Battle scar (above right eye — shows experience) ──
    d.line([(cx+18, eye_y-7), (cx+26, eye_y-19)],
           fill=ck(158,128,108,255), width=2)

    # ── Hands open — teaching gesture ──
    # Left hand (palm open, slightly forward)
    d.ellipse([cx-80, cy+94, cx-44, cy+128], fill=gi)
    d.ellipse([cx-78, cy+88, cx-50, cy+118], fill=skin)
    # Right hand
    d.ellipse([cx+44, cy+94, cx+80, cy+128], fill=gi)
    d.ellipse([cx+50, cy+88, cx+78, cy+118], fill=skin)

    # ── Gi collar accent lines ──
    d.line([(cx-82, cy-52), (cx-28, cy-22)], fill=(*ORG, 130), width=2)
    d.line([(cx+82, cy-52), (cx+28, cy-22)], fill=(*ORG, 130), width=2)

    # Final soft aura
    img = glow(img, cx, cy-60, 115, PRP, 35, 48)

    img.save(os.path.join(OUT, "master-kael-avatar.png"), "PNG")
    print("✓  master-kael-avatar.png")

# ══════════════════════════════════════════════════════════════════════════════
# FIGHTER ICONS — 200×200 transparent
# ══════════════════════════════════════════════════════════════════════════════

def make_icon(filename, pose, primary, accent, label):
    W, H = 200, 200
    img  = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    cx, cy = W // 2, H // 2 + 6
    s  = 68                                    # figure scale

    # ── Layered aura ──
    img = glows(img, cx, cy, [
        (90,  primary, 30, 38),
        (58,  primary, 55, 22),
        (32,  accent,  50, 14),
        (16,  WHITE,   35,  7),
    ])

    # ── Energy lines ──
    img = Image.alpha_composite(
        img, burst(W, H, cx, cy, 28, primary,  32, 92, 90, seed=hash(filename) % 77))
    img = Image.alpha_composite(
        img, burst(W, H, cx, cy, 14, accent,   40, 75, 60, seed=hash(filename) % 33 + 10))

    # ── Silhouette ──
    img = silhouette(img, cx, cy, s, (*BLACK, 245), pose)

    # ── Bright core spark ──
    img = glow(img, cx, cy - int(s*0.42), 14, primary, 180, 7)
    img = glow(img, cx, cy - int(s*0.42),  6, WHITE,   160, 3)

    # ── Archetype label ──
    f = font("GeistMono-Regular.ttf", 10)
    d = ImageDraw.Draw(img)
    try:
        tw = d.textlength(label, font=f)
    except:
        tw = len(label) * 6
    d.text((cx - tw // 2, H - 17), label, fill=(*primary, 200), font=f)

    img.save(os.path.join(OUT, filename), "PNG")
    print(f"✓  {filename}")

# ══════════════════════════════════════════════════════════════════════════════
# IMAGE 7 — zenkai-boost-bg.png  1080×1920
# ══════════════════════════════════════════════════════════════════════════════

def make_zenkai_bg():
    W, H = 1080, 1920
    img  = Image.new("RGBA", (W, H), (*BG, 255))
    cx   = W // 2
    src  = H - 180                              # energy source (bottom)

    # ── Deep atmospheric glows ──
    img = glows(img, cx, src, [
        (600, GOLD, 28, 220),
        (380, ORG,  48, 130),
        (200, GOLD, 65,  70),
        ( 90, WHITE, 55, 35),
    ])
    img = glows(img, cx, H // 3, [
        (450, PRP, 35, 160),
        (280, PRP, 50, 100),
        (130, LPRP, 40, 55),
    ])
    img = glow(img, cx, H // 6, 300, PRP, 25, 130)

    # ── Rising energy bursts ──
    for s in range(6):
        img = Image.alpha_composite(
            img, burst(W, H, cx, src, 65, GOLD, 60, int(H*0.92), 52, s*9))
    for s in range(4):
        img = Image.alpha_composite(
            img, burst(W, H, cx, src, 35, PRP, 90, int(H*0.75), 70, s*11+4))
    for s in range(2):
        img = Image.alpha_composite(
            img, burst(W, H, cx, src, 18, WHITE, 70, int(H*0.5), 50, s*17+8))

    # ── Vertical energy column ──
    rng = random.Random(55)
    col = Image.new("RGBA", (W, H), (0,0,0,0))
    dc  = ImageDraw.Draw(col)
    for _ in range(40):
        xv  = cx + rng.randint(-20, 20)
        alp = rng.randint(18, 55)
        dc.line([(xv, src), (xv + rng.randint(-25, 25), 0)],
                fill=(*GOLD, alp), width=rng.randint(1, 3))
    col = col.filter(ImageFilter.GaussianBlur(4))
    img = Image.alpha_composite(img, col)

    # ── Figure — emerging at bottom ──
    fig_cy = src - 95
    img    = silhouette(img, cx, fig_cy, 230, (*BLACK, 255), 'rise')
    img    = glow(img, cx, fig_cy - 80, 160, GOLD,  110, 65)
    img    = glow(img, cx, fig_cy - 80,  75, WHITE,  70, 30)

    # ── Grid ──
    img = Image.alpha_composite(img, grid_overlay(W, H, 60, PRP, 7))
    img = Image.alpha_composite(img, scanlines(W, H, 18))

    # ── Typography ──
    f_title = font("BigShoulders-Bold.ttf",    128)
    f_sub   = font("InstrumentSans-Regular.ttf", 32)
    f_mono  = font("GeistMono-Regular.ttf",      22)
    dt      = ImageDraw.Draw(img)

    # ZENKAI — top center
    try:
        tw = dt.textlength("ZENKAI", font=f_title)
    except:
        tw = 128 * 6
    dt.text((cx - tw // 2, 88), "ZENKAI", fill=(*WHITE, 225), font=f_title)

    # Underline
    dt.line([(cx - tw//2, 228), (cx + tw//2, 228)],
            fill=(*GOLD, 180), width=3)

    # Sub lines
    lines = [
        ("You fell. You came back.",     GOLD, 258),
        ("That is the Zenkai way.",      ORG,  300),
    ]
    for txt, col, y in lines:
        try:    lw = dt.textlength(txt, font=f_sub)
        except: lw = len(txt) * 18
        dt.text((cx - lw // 2, y), txt, fill=(*col, 185), font=f_sub)

    # Bottom label
    bot = "POWER SURGE ACTIVATED"
    try:    bw = dt.textlength(bot, font=f_mono)
    except: bw = len(bot) * 13
    dt.text((cx - bw // 2, H - 60), bot, fill=(*PRP, 140), font=f_mono)

    # Vignette
    img = Image.alpha_composite(img, vignette(W, H, 100, 120))

    img.convert("RGB").save(os.path.join(OUT, "zenkai-boost-bg.png"), "PNG")
    print("✓  zenkai-boost-bg.png")

# ══════════════════════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    print("Generating Zenkai assets...\n")
    make_hero()
    make_kael()
    make_icon("comeback-king.png",  "rise",       GOLD, ORG,  "COMEBACK KING")
    make_icon("unbreakable.png",    "stand_firm", PRP,  LPRP, "UNBREAKABLE")
    make_icon("survivor.png",       "stride",     ORG,  GOLD, "SURVIVOR")
    make_icon("quiet-beast.png",    "meditate",   GOLD, PRP,  "QUIET BEAST")
    make_zenkai_bg()
    print("\nAll 7 assets saved →", OUT)
