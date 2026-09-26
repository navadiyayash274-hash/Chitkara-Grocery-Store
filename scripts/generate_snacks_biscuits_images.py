from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

root = Path(__file__).resolve().parent.parent / 'images' / 'snacks-biscuits'
root.mkdir(parents=True, exist_ok=True)

products = {
    'parle-g-biscuits': ('Parle-G', 'Parle', '800 g', '#f7d49a', '#d27b2c', '#9a4f11', '72'),
    'britannia-good-day': ('Good Day', 'Britannia', '200 g', '#f3dba7', '#d98c2f', '#8f5a12', '68'),
    'britannia-marie-gold': ('Marie Gold', 'Britannia', '250 g', '#f6edc7', '#d9b455', '#91771d', '90'),
    'britannia-bourbon': ('Bourbon', 'Britannia', '150 g', '#f0e2d2', '#8c583a', '#5a341f', '62'),
    'britannia-nutrichoice': ('NutriChoice', 'Britannia', '300 g', '#e8f3d8', '#6ca85e', '#375a29', '88'),
    'oreo-original': ('Oreo', 'Oreo', '120 g', '#f3efe8', '#3b2b2a', '#1d1717', '82'),
    'sunfeast-dark-fantasy': ('Dark Fantasy', 'Sunfeast', '300 g', '#e9d1bc', '#7b4a2b', '#512d1b', '120'),
    'sunfeast-marie-light': ('Marie Light', 'Sunfeast', '250 g', '#f0f1e7', '#7da866', '#4d6d3c', '90'),
    'hide-and-seek': ('Hide & Seek', 'Parle', '120 g', '#e8dccf', '#8f6543', '#563823', '86'),
    'krackjack': ('KrackJack', 'Parle', '200 g', '#f6e0c1', '#d88538', '#8c4d17', '65'),
    'monaco': ('Monaco', 'Parle', '200 g', '#f2e8d1', '#c9954b', '#916426', '60'),
    'bourbon-cream': ('Bourbon', 'Parle', '150 g', '#f5e9dd', '#aa6b3c', '#74451f', '48'),
    'lays-classic-salted': ('Classic Salted', 'Lay\'s', '50 g', '#f9f0d4', '#d6b754', '#9d7c20', '40'),
    'lays-magic-masala': ('Magic Masala', 'Lay\'s', '50 g', '#f8dad6', '#d25d4d', '#8b3329', '40'),
    'lays-cream-onion': ('Cream & Onion', 'Lay\'s', '50 g', '#ede7d7', '#b89a62', '#785f2a', '40'),
    'kurkure-masala-munch': ('Masala Munch', 'Kurkure', '90 g', '#f4dcc2', '#d56b3d', '#8d3d1f', '45'),
    'kurkure-chilli-chatka': ('Chilli Chatka', 'Kurkure', '90 g', '#f2d4d1', '#d45552', '#8b2f2f', '45'),
    'bingo-tedhe-medhe': ('Tedhe Medhe', 'Bingo', '90 g', '#f7e8c4', '#cf9a36', '#8a6414', '50'),
    'bingo-mad-angles': ('Mad Angles', 'Bingo', '90 g', '#f2dfd9', '#c76c4b', '#854530', '50'),
    'haldirams-aloo-bhujia': ('Aloo Bhujia', 'Haldiram\'s', '200 g', '#e4c792', '#b77825', '#795017', '120'),
    'haldirams-bhujia-sev': ('Bhujia Sev', 'Haldiram\'s', '200 g', '#e9d9b9', '#bd8d3a', '#7e5b1b', '110'),
    'haldirams-moong-dal': ('Moong Dal', 'Haldiram\'s', '200 g', '#e5d8b8', '#7a8f48', '#4d5d2a', '120'),
    'balaji-wafers': ('Wafers', 'Balaji', '150 g', '#f2e5c3', '#b8893d', '#71511d', '75'),
    'balaji-masala-wafers': ('Masala Wafers', 'Balaji', '150 g', '#f7e2d6', '#cf6a4d', '#873a2b', '75'),
    'uncle-chipps': ('Uncle Chipps', 'Uncle Chipps', '55 g', '#f5eec7', '#c3a43f', '#7c660f', '35'),
    'too-yumm-chips': ('Too Yumm!', 'Too Yumm!', '60 g', '#e7f0d9', '#6f9b53', '#425d2a', '45'),
    'five-star-chocolate': ('5 Star', 'Cadbury', '45 g', '#f1e7d5', '#c76c3f', '#7c4023', '35'),
    'dairy-milk': ('Dairy Milk', 'Cadbury', '110 g', '#f5ebdc', '#b98e5c', '#6b4d2d', '60'),
    'perk-chocolate': ('Perk', 'Cadbury', '40 g', '#d7d3bc', '#9b9658', '#67611e', '25'),
    'kitkat': ('KitKat', 'KitKat', '41.5 g', '#e7e8ef', '#7a7f90', '#4d5564', '35'),
}

try:
    font = ImageFont.truetype('arial.ttf', 26)
    mini = ImageFont.truetype('arial.ttf', 22)
except Exception:
    font = ImageFont.load_default()
    mini = ImageFont.load_default()

for slug, (name, brand, qty, bg, accent, deep, price) in products.items():
    img = Image.new('RGB', (1000, 1200), 'white')
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, 0, 1000, 120), fill=accent)
    draw.rectangle((0, 120, 1000, 1200), fill=bg)
    pack = (150, 180, 850, 1000)
    draw.rounded_rectangle(pack, radius=35, fill='white', outline=deep, width=8)
    draw.rounded_rectangle((200, 230, 800, 930), radius=28, fill=accent, outline=deep, width=6)
    draw.rounded_rectangle((235, 260, 765, 410), radius=20, fill=deep)
    draw.text((500, 330), brand.upper(), fill='white', anchor='mm', font=font)
    lines = [name]
    if len(name) > 14:
        words = name.split()
        if len(words) > 1:
            first = ' '.join(words[:2])
            second = ' '.join(words[2:])
            if second:
                lines = [first, second]
    for i, line in enumerate(lines):
        draw.text((500, 480 + i * 54), line.upper(), fill='black', anchor='mm', font=mini)
    draw.rounded_rectangle((290, 620, 710, 710), radius=18, fill='white', outline=deep, width=4)
    draw.text((500, 665), qty, fill=deep, anchor='mm', font=font)
    draw.rounded_rectangle((280, 770, 720, 870), radius=24, fill='white', outline=deep, width=4)
    draw.text((500, 820), f'Rs. {price}', fill=deep, anchor='mm', font=font)
    draw.text((500, 1030), 'FRESH CRUNCH', fill=deep, anchor='mm', font=mini)
    out = root / f'{slug}.jpg'
    img.save(out, quality=95)
    print(f'Created {out}')
