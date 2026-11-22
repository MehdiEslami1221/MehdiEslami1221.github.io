"""Raster exports of the existing monogram, with an opaque charcoal canvas.

Developer-only utility: python3 scripts/export-app-icons.py (requires Pillow).
The portfolio itself remains dependency-free.
"""
from pathlib import Path
import xml.etree.ElementTree as ET
from PIL import Image, ImageDraw

assets = Path(__file__).resolve().parent.parent / "assets"
svg = ET.parse(assets / "logo.svg").getroot()
polygons = []


def collect(element, fill=None):
    fill = element.get("fill", fill)
    if element.tag.endswith("polygon"):
        points = [tuple(map(float, pair.split(","))) for pair in element.get("points").split()]
        polygons.append((fill, points))
    for child in element:
        collect(child, fill)


collect(svg)
for filename, size, mark_width in [
    ("app-icon-192.png", 192, 128),
    ("app-icon-512.png", 512, 340),
    ("app-icon-maskable-512.png", 512, 300),
]:
    # Center the visible geometry (x=8..128, y=12..88), not its SVG margins.
    image = Image.new("RGB", (size * 4, size * 4), "#080a09")
    draw = ImageDraw.Draw(image)
    scale = mark_width / 120
    for fill, points in polygons:
        draw.polygon([((size / 2 + (x - 68) * scale) * 4,
                       (size / 2 + (y - 50) * scale) * 4) for x, y in points], fill=fill)
    image.resize((size, size), Image.Resampling.LANCZOS).save(assets / filename, optimize=True)
    print(filename)
