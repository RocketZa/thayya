# Mobile-first hero validation (UI-UX.md A8.5)
# Screenshots the hero above-the-fold at all required viewports and asserts:
#  - headline, supporting copy, and primary CTA fully above the fold (mobile)
#  - no console/page errors
import os
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3000"
OUT = os.path.join(os.path.dirname(__file__), "shots")
os.makedirs(OUT, exist_ok=True)

VIEWPORTS = [
    ("mobile-360x800", 360, 800, True),
    ("mobile-375x812", 375, 812, True),
    ("mobile-390x844", 390, 844, True),
    ("mobile-412x915", 412, 915, True),
    ("tablet-768x1024", 768, 1024, False),
    ("desktop-1440x900", 1440, 900, False),
    ("desktop-1920x1080", 1920, 1080, False),
]

failures = []

with sync_playwright() as p:
    browser = p.chromium.launch()
    for name, w, h, is_mobile in VIEWPORTS:
        ctx = browser.new_context(viewport={"width": w, "height": h},
                                  device_scale_factor=2, is_mobile=is_mobile)
        page = ctx.new_page()
        errors = []
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(BASE, wait_until="networkidle")
        page.wait_for_timeout(4500)  # loader + hero reveal

        # fold check: h1, sub copy, primary CTA fully within viewport height
        for label, sel in [("headline", "#top h1"),
                           ("supporting copy", "#top h1 ~ p"),
                           ("primary CTA", "#top a.btn")]:
            box = page.locator(sel).first.bounding_box()
            if box is None:
                failures.append(f"{name}: {label} not found")
            elif box["y"] + box["height"] > h + 1:
                failures.append(
                    f"{name}: {label} below the fold "
                    f"(bottom={box['y']+box['height']:.0f}px, viewport={h}px)")

        if errors:
            failures.append(f"{name}: console/page errors: {errors[:3]}")

        page.screenshot(path=os.path.join(OUT, f"hero-{name}.png"))
        ctx.close()

    # concept mockup sheet
    ctx = browser.new_context(viewport={"width": 1500, "height": 1100})
    page = ctx.new_page()
    page.goto("file:///" + os.path.join(os.path.dirname(os.path.abspath(__file__)),
              "design", "hero-concepts.html").replace("\\", "/"))
    page.wait_for_timeout(800)
    page.screenshot(path=os.path.join(OUT, "hero-concepts.png"), full_page=True)
    ctx.close()
    browser.close()

if failures:
    print("FAIL")
    for f in failures:
        print(" -", f)
else:
    print("PASS — headline, copy, and primary CTA above the fold at all viewports; no errors")
