from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

root = Path(__file__).resolve().parents[1]
img_dir = root / 'images' / 'household-cleaning'
img_dir.mkdir(parents=True, exist_ok=True)

font_candidates = [
    'C:/Windows/Fonts/arialbd.ttf',
    'C:/Windows/Fonts/arial.ttf',
    'DejaVuSans-Bold.ttf',
    'DejaVuSans.ttf',
]


def load_font(size, bold=True):
    for candidate in font_candidates:
        if bold and candidate.endswith('arial.ttf'):
            continue
        if not bold and candidate.endswith('arialbd.ttf'):
            continue
        try:
            return ImageFont.truetype(candidate, size)
        except OSError:
            continue
    return ImageFont.load_default()

products = [
    ('surf-excel-matic-detergent', 'Surf Excel', 'Matic Detergent', '#f4b400', '#f5d76e'),
    ('ariel-matic-detergent', 'Ariel', 'Matic Detergent', '#1e3a8a', '#93c5fd'),
    ('tide-plus-detergent', 'Tide', 'Plus Detergent', '#0f766e', '#99f6e4'),
    ('rin-detergent-powder', 'Rin', 'Detergent Powder', '#e11d48', '#f9a8d4'),
    ('vim-dishwash-liquid', 'Vim', 'Dishwash Liquid', '#f97316', '#fdba74'),
    ('vim-dishwash-bar', 'Vim', 'Dishwash Bar', '#f59e0b', '#fcd34d'),
    ('harpic-toilet-cleaner', 'Harpic', 'Toilet Cleaner', '#0ea5e9', '#7dd3fc'),
    ('domex-toilet-cleaner', 'Domex', 'Toilet Cleaner', '#3b82f6', '#bfdbfe'),
    ('lizol-floor-cleaner', 'Lizol', 'Floor Cleaner', '#22c55e', '#86efac'),
    ('colin-glass-cleaner', 'Colin', 'Glass Cleaner', '#14b8a6', '#99f6e4'),
    ('dettol-liquid', 'Dettol', 'Liquid', '#16a34a', '#86efac'),
    ('dettol-disinfectant-spray', 'Dettol', 'Disinfectant Spray', '#0f766e', '#5eead4'),
    ('comfort-fabric-conditioner', 'Comfort', 'Fabric Conditioner', '#a855f7', '#d8b4fe'),
    ('easy-wash-fabric-conditioner', 'Easy Wash', 'Fabric Conditioner', '#7c3aed', '#ddd6fe'),
    ('odonil-room-freshener', 'Odonil', 'Room Freshener', '#ec4899', '#f9a8d4'),
    ('godrej-aer-room-freshener', 'Godrej Aer', 'Room Freshener', '#f43f5e', '#fda4af'),
    ('hit-anti-roach-spray', 'HIT', 'Anti-Roach Spray', '#334155', '#cbd5e1'),
    ('good-knight-mosquito-repellent', 'Good Knight', 'Mosquito Repellent', '#374151', '#d1d5db'),
    ('mortein-insect-killer', 'Mortein', 'Insect Killer', '#d97706', '#fdba74'),
    ('scotch-brite-scrub-pad', 'Scotch-Brite', 'Scrub Pad', '#2563eb', '#93c5fd'),
    ('scotch-brite-floor-wiper', 'Scotch-Brite', 'Floor Wiper', '#1d4ed8', '#a5b4fc'),
    ('gala-floor-mop', 'Gala', 'Floor Mop', '#64748b', '#cbd5e1'),
    ('gala-broom', 'Gala', 'Broom', '#475569', '#e2e8f0'),
    ('garbage-bags', 'Presto', 'Garbage Bags', '#0ea5e9', '#bae6fd'),
    ('kitchen-tissue-roll', 'Origami', 'Kitchen Tissue', '#f59e0b', '#fde68a'),
    ('toilet-tissue-roll', 'Origami', 'Toilet Tissue', '#fbbf24', '#fef3c7'),
    ('surf-excel-liquid-detergent', 'Surf Excel', 'Liquid Detergent', '#f59e0b', '#fed7aa'),
    ('ariel-liquid-detergent', 'Ariel', 'Liquid Detergent', '#2563eb', '#bfdbfe'),
    ('dettol-floor-cleaner', 'Dettol', 'Floor Cleaner', '#10b981', '#a7f3d0'),
    ('vim-power-and-shine', 'Vim', 'Power & Shine', '#f97316', '#fdba74'),
]

for slug, brand, product_name, color_a, color_b in products:
    img = Image.new('RGB', (800, 1000), '#f8fafc')
    draw = ImageDraw.Draw(img)

    # gradient-like background
    for y in range(1000):
        ratio = y / 1000
        r = int((1 - ratio) * 255 + ratio * 0)
        color = (r, 0, 0)

    # large abstract background panels
    bg1 = Image.new('RGB', (800, 1000), color_a)
    bg2 = Image.new('RGB', (800, 1000), color_b)
    for y in range(1000):
        alpha = y / 1000
        merged = tuple(int(bg1.getpixel((0, y))[i] * (1 - alpha) + bg2.getpixel((0, y))[i] * alpha) for i in range(3))
        draw.line((0, y, 800, y), fill=merged)

    # pack body
    pack = Image.new('RGB', (440, 640), '#ffffff')
    pack_draw = ImageDraw.Draw(pack)
    pack_draw.rounded_rectangle((30, 30, 410, 610), radius=26, fill=(255, 255, 255), outline=(0, 0, 0, 80), width=2)
    pack_draw.rectangle((60, 60, 380, 150), fill=color_a)
    pack_draw.text((80, 75), brand.upper(), fill='white', font=load_font(34, bold=True), anchor='la')
    pack_draw.text((80, 200), product_name.upper(), fill='#111827', font=load_font(34, bold=True), anchor='la')
    pack_draw.text((80, 300), 'HOUSEHOLD', fill='#374151', font=load_font(18, bold=False), anchor='la')
    pack_draw.text((80, 330), 'ESSENTIALS', fill='#374151', font=load_font(18, bold=False), anchor='la')
    pack_draw.rounded_rectangle((80, 380, 350, 520), radius=18, fill=color_b)
    pack_draw.text((215, 430), 'REAL', fill='#111827', font=load_font(30, bold=True), anchor='mm')
    pack_draw.text((215, 470), 'CARE', fill='#111827', font=load_font(30, bold=True), anchor='mm')

    # place pack in main image
    img.paste(pack, (180, 140))

    # add subtle patterns
    for i in range(0, 800, 80):
        draw.rounded_rectangle((i, 0, i + 30, 1000), radius=10, fill=(255, 255, 255, 35))

    # product tag
    draw.rounded_rectangle((120, 830, 680, 920), radius=24, fill=(27, 27, 27, 180))
    draw.text((400, 875), 'HOME CARE', fill='white', font=load_font(42, bold=True), anchor='mm')

    out = img_dir / f'{slug}.jpg'
    img.save(out, quality=95)
    print(f'Created {out}')
