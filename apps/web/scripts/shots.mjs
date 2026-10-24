import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const out = process.env.SHOT_DIR ?? '../../ci-out/shots';
mkdirSync(out, { recursive: true });
const base = process.env.BASE_URL ?? 'http://localhost:3000';
const sizes = [[390, 844], [360, 800]];
const browser = await chromium.launch();
const errors = [];
for (const [w, h] of sizes) {
  for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(base + '/en/dev/design', { waitUntil: 'networkidle' });
    await page.screenshot({ path: `${out}/design-${w}-${scheme}.png`, fullPage: true });
    // horizontal overflow check
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) errors.push(`horizontal overflow ${overflow}px at ${w} ${scheme}`);
    // tap target check (44px)
    const small = await page.evaluate(() => [...document.querySelectorAll('button, a, input')].filter((e) => {
      if (e.tagName === 'A' && getComputedStyle(e).display === 'inline') return false; // inline text links are exempt (WCAG 2.2 target size)
      const box = e.tagName === 'INPUT' ? (e.closest('label') ?? e) : e;
      const r = box.getBoundingClientRect();
      return r.height > 0 && r.height < 44;
    }).map((e) => e.outerHTML.slice(0, 60)));
    if (small.length) errors.push(`small tap targets at ${w} ${scheme}: ${small.join(' | ')}`);
    await ctx.close();
  }
}
await browser.close();
console.log('ERRORS', JSON.stringify(errors));
