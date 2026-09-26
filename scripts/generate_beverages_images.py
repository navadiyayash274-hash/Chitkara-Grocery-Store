from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

root = Path(__file__).resolve().parent.parent / 'images' / 'beverages'
root.mkdir(parents=True, exist_ok=True)

products = {
    'coca-cola-750ml': ('Coca-Cola', 'Coca-Cola', '750 ml', '#f8f8f8', '#e11d2e', '#b10d22', '65'),
    'coca-cola-1250ml': ('Coca-Cola', 'Coca-Cola', '1.25 L', '#f8f8f8', '#d51d36', '#8e1126', '118'),
    'thums-up-750ml': ('Thums Up', 'Thums Up', '750 ml', '#fff8ec', '#ef6b1a', '#b6500d', '78'),
    'sprite-750ml': ('Sprite', 'Sprite', '750 ml', '#f5fcff', '#35c58a', '#1d985f', '70'),
    'fanta-orange-750ml': ('Fanta Orange', 'Fanta', '750 ml', '#fff5ec', '#ff9f1c', '#dc6b09', '68'),
    'limca-750ml': ('Limca', 'Limca', '750 ml', '#f6fffb', '#2ac46a', '#13985e', '72'),
    'maaza-mango-1200ml': ('Maaza Mango', 'Maaza', '1.2 L', '#fff5ef', '#ff9d1f', '#e06b09', '88'),
    'frooti-mango-drink-1l': ('Frooti', 'Frooti', '1 L', '#fff7ef', '#f59f00', '#d57a00', '62'),
    'slice-mango-drink-1200ml': ('Slice Mango', 'Slice', '1.2 L', '#fff5e9', '#ff8c26', '#d96f10', '95'),
    'real-mixed-fruit-juice-1l': ('Mixed Fruit', 'Real', '1 L', '#fffaf2', '#ff6b35', '#d64b2a', '102'),
    'real-orange-juice-1l': ('Orange Juice', 'Real', '1 L', '#fff7ed', '#ff9200', '#d66d00', '105'),
    'tropicana-mixed-fruit-1l': ('Mixed Fruit', 'Tropicana', '1 L', '#fff9f2', '#ff8a00', '#d76a00', '118'),
    'tropicana-orange-1l': ('Orange', 'Tropicana', '1 L', '#fff9ef', '#ff9c25', '#e7770b', '118'),
    'paper-boat-aamras-250ml': ('Aamras', 'Paper Boat', '250 ml', '#fff8e8', '#ffb61e', '#d68d00', '45'),
    'paper-boat-coconut-water-200ml': ('Coconut Water', 'Paper Boat', '200 ml', '#edfdfc', '#1cc3c8', '#159aa4', '51'),
    'amul-kool-chocolate-200ml': ('Chocolate', 'Amul', '200 ml', '#fdf5ee', '#824d20', '#5b310d', '50'),
    'amul-kool-kesar-200ml': ('Kesar', 'Amul', '200 ml', '#fff9f1', '#f0b92b', '#c89100', '52'),
    'nescafe-classic-coffee-100g': ('Classic Coffee', 'Nescafé', '100 g', '#f8f3ec', '#6f4b35', '#4e3528', '430'),
    'bru-instant-coffee-100g': ('Instant Coffee', 'BRU', '100 g', '#f5efe8', '#5f4638', '#432d25', '410'),
    'tata-tea-gold-500g': ('Tea Gold', 'Tata Tea', '500 g', '#f9f2e8', '#d3972a', '#9e6820', '245'),
    'red-label-tea-500g': ('Red Label', 'Brooke Bond', '500 g', '#fcf7ef', '#e77b34', '#bf4a17', '235'),
    'taj-mahal-tea-500g': ('Taj Mahal', 'Brooke Bond', '500 g', '#f7efe7', '#b87a37', '#8a541a', '228'),
    'horlicks-500g': ('Horlicks', 'Horlicks', '500 g', '#fffaf2', '#c58e42', '#8a6217', '290'),
    'bournvita-500g': ('Bournvita', 'Cadbury Bournvita', '500 g', '#f5f0ea', '#8d4a2d', '#5c2d1e', '275'),
    'complan-chocolate-500g': ('Complan', 'Complan', '500 g', '#f7f0eb', '#7a4b2f', '#4e2f1d', '300'),
    'tang-orange-drink-mix-500g': ('Orange Mix', 'Tang', '500 g', '#fff4e7', '#ff9d1b', '#d27d00', '175'),
    'glucon-d-orange-500g': ('Orange', 'Glucon-D', '500 g', '#fff3e1', '#ffb100', '#d68d00', '160'),
    'red-bull-energy-drink-250ml': ('Energy Drink', 'Red Bull', '250 ml', '#fff9e8', '#f4c61f', '#d49d00', '170'),
    'sting-energy-drink-250ml': ('Energy Drink', 'Sting', '250 ml', '#fffaf0', '#ff7d1d', '#d95d00', '90'),
    'bisleri-mineral-water-1l': ('Mineral Water', 'Bisleri', '1 L', '#edf6ff', '#1c7ae6', '#0b4ea2', '30'),
}

try:
    font = ImageFont.truetype('arial.ttf', 42)
    small_font = ImageFont.truetype('arial.ttf', 32)
except Exception:
    font = ImageFont.load_default()
    small_font = ImageFont.load_default()

for slug, (name, brand, qty, bg, accent, deep, price) in products.items():
    img = Image.new('RGB', (1000, 1400), 'white')
    draw = ImageDraw.Draw(img)

    draw.rectangle((0, 0, 1000, 180), fill=accent)
    draw.rectangle((0, 180, 1000, 1400), fill=bg)

    pack = (160, 230, 840, 1230)
    draw.rounded_rectangle(pack, radius=36, fill='white', outline=deep, width=8)
    draw.rounded_rectangle((200, 280, 800, 1160), radius=28, fill=accent, outline=deep, width=6)
    draw.rounded_rectangle((220, 300, 780, 430), radius=22, fill=deep)
    draw.text((500, 365), brand.upper(), fill='white', anchor='mm', font=font)

    lines = [name]
    if len(name) > 16:
        words = name.split()
        if len(words) > 1:
            first = ' '.join(words[:2])
            second = ' '.join(words[2:])
            if second:
                lines = [first, second]
    for i, line in enumerate(lines):
        draw.text((500, 520 + i * 80), line.upper(), fill='black', anchor='mm', font=small_font)

    draw.rounded_rectangle((310, 700, 690, 780), radius=18, fill='white', outline=deep, width=4)
    draw.text((500, 740), qty, fill=deep, anchor='mm', font=font)

    draw.rounded_rectangle((300, 860, 700, 980), radius=26, fill='white', outline=deep, width=4)
    draw.text((500, 920), f'Rs. {price}', fill=deep, anchor='mm', font=font)

    for y in [1030, 1085, 1140]:
        draw.line((285, y, 715, y), fill=(200, 200, 200), width=3)

    draw.text((500, 1275), 'FRESHLY PACKED', fill=deep, anchor='mm', font=small_font)
    out = root / f'{slug}.jpg'
    img.save(out, quality=95)
    print(f'Created {out}')
