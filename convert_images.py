from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent
EXTS = {".jpg", ".jpeg", ".png"}


def is_small(image: Image.Image) -> bool:
    return image.width * image.height <= 200 * 200


def convert(path: Path) -> None:
    out_path = path.with_suffix(".webp")
    if out_path.exists():
        return

    with Image.open(path) as img:
        img = img.convert("RGBA") if img.mode in ("P", "RGBA") else img.convert("RGB")

        # Heuristic: preserve tiny assets losslessly.
        lossless = is_small(img) or "logo" in path.stem.lower()

        img.save(
            out_path,
            format="WEBP",
            quality=82 if not lossless else 100,
            method=6,
            lossless=lossless,
        )


def main() -> None:
    for path in ROOT.iterdir():
        if path.suffix.lower() in EXTS:
            convert(path)


if __name__ == "__main__":
    main()
