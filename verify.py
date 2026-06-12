import os
from playwright.sync_api import sync_playwright

SHOTS = os.path.join(os.path.dirname(__file__), "shots")
os.makedirs(SHOTS, exist_ok=True)

errors = []

def run(pw, width, height, tag, positions):
    browser = pw.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": width, "height": height})
    page.on("console", lambda m: errors.append(f"[{tag}][console.{m.type}] {m.text}") if m.type in ("error", "warning") else None)
    page.on("pageerror", lambda e: errors.append(f"[{tag}][pageerror] {e}"))

    page.goto("http://localhost:3000", wait_until="networkidle")
    page.wait_for_timeout(3500)  # loader (~2.2s) + hero reveal
    page.screenshot(path=f"{SHOTS}/{tag}-00-hero.png")

    total = page.evaluate("document.body.scrollHeight")
    print(f"[{tag}] scrollHeight = {total}")

    for i, frac in enumerate(positions, start=1):
        target = int(total * frac)
        # step-scroll so Lenis/ScrollTrigger scrubs progress naturally
        page.evaluate(f"""
            (async () => {{
                const target = {target};
                const start = window.scrollY;
                const steps = 30;
                for (let s = 1; s <= steps; s++) {{
                    window.scrollTo(0, start + (target - start) * (s / steps));
                    await new Promise(r => setTimeout(r, 30));
                }}
            }})()
        """)
        page.wait_for_timeout(1800)
        page.screenshot(path=f"{SHOTS}/{tag}-{i:02d}-at-{int(frac*100)}pct.png")

    browser.close()

with sync_playwright() as p:
    run(p, 1440, 900, "desktop", [0.08, 0.16, 0.24, 0.32, 0.42, 0.52, 0.62, 0.72, 0.82, 0.92, 1.0])
    run(p, 390, 844, "mobile", [0.15, 0.35, 0.55, 0.75, 0.95])

print("\n--- console/page errors ---")
if errors:
    for e in errors:
        print(e)
else:
    print("none")
print(f"\nscreenshots in {SHOTS}")
