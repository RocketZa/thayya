import os
from playwright.sync_api import sync_playwright

SHOTS = os.path.join(os.path.dirname(__file__), "shots")
errors = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.on("pageerror", lambda e: errors.append(f"[pageerror] {e}"))
    page.on("console", lambda m: errors.append(f"[console.error] {m.text}") if m.type == "error" else None)

    page.goto("http://localhost:3000", wait_until="networkidle")
    page.wait_for_timeout(4200)
    page.screenshot(path=f"{SHOTS}/fix-hero.png")

    # no-JS pass: headline must be visible without JavaScript
    ctx = browser.new_context(java_script_enabled=False, viewport={"width": 1440, "height": 900})
    nojs = ctx.new_page()
    nojs.goto("http://localhost:3000", wait_until="load")
    nojs.wait_for_timeout(1200)
    nojs.screenshot(path=f"{SHOTS}/fix-hero-nojs.png")

    browser.close()

print("errors:", errors if errors else "none")
