import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const out = process.env.SHOT_DIR ?? '../../ci-out/shots';
mkdirSync(out, { recursive: true });
const base = process.env.BASE_URL ?? 'http://localhost:3000';
// [name, path, text that must be visible]
const pages = [
  ['design', '/en/dev/design', 'Design system'],
  ['home', '/en', 'Lead story'],
  ['home-fr', '/fr', 'À la une'],
  ['explore', '/en/explore', 'Trending this week'],
  ['explore-fr', '/fr/explore', 'Tendances de la semaine'],
  ['search', '/en/explore?q=Kora%20Frieght', 'Kora Freight'],
  ['person', '/en/people/nia-mensah', 'Key facts'],
  ['person-ama', '/en/people/ama-boateng', 'Request intro'],
  ['person-unclaimed', '/en/people/priya-raman', 'Compiled from public sources'],
  ['company', '/en/companies/kora-freight', 'Community round'],
  ['company-fr', '/fr/companies/aya-health', 'Tour de table communautaire'],
  ['notfound', '/en/people/nobody', 'We could not find that page'],
];
const sizes = [[390, 844], [360, 800], [1280, 800]];
const browser = await chromium.launch();
const errors = [];
for (const [name, path, mustSee] of pages) {
  for (const [w, h] of sizes) {
    for (const scheme of ['light', 'dark']) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, deviceScaleFactor: 2 });
      const page = await ctx.newPage();
      page.on('pageerror', (e) => errors.push(`${name} ${w} ${scheme}: ${e}`));
      page.on('console', (m) => { if (m.type() === 'error') errors.push(`${name} ${w} ${scheme}: ${m.text()}`); });
      await page.goto(base + path, { waitUntil: 'networkidle' });
      if (!(await page.getByText(mustSee, { exact: false }).first().isVisible())) errors.push(`missing text "${mustSee}": ${name} ${w} ${scheme}`);
      await page.screenshot({ path: `${out}/${name}-${w}-${scheme}.png`, fullPage: true });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 0) errors.push(`horizontal overflow ${overflow}px: ${name} ${w} ${scheme}`);
      const small = await page.evaluate(() => [...document.querySelectorAll('button, a, input')].filter((e) => {
        if (e.tagName === 'A' && getComputedStyle(e).display === 'inline') return false;
        const box = e.tagName === 'INPUT' ? (e.closest('label') ?? e.parentElement ?? e) : e;
        const r = box.getBoundingClientRect();
        return r.height > 0 && r.height < 44;
      }).map((e) => e.outerHTML.slice(0, 70)));
      if (small.length) errors.push(`small tap targets ${name} ${w} ${scheme}: ${small.join(' | ')}`);
      if (name !== 'design') {
        const navs = await page.evaluate(() => [...document.querySelectorAll('nav')].filter((n) => n.getBoundingClientRect().height > 0).length);
        if (navs !== 1) errors.push(`expected exactly 1 visible nav, got ${navs}: ${name} ${w}`);
      }
      await ctx.close();
    }
  }
}

// Interaction flows (phone, light)
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`flow: ${e}`));
  await page.goto(base + '/en/explore', { waitUntil: 'networkidle' });
  const box = page.getByRole('searchbox', { name: /search people/i });
  await box.fill('zuri');
  await page.getByText('Zuri Energy').first().waitFor({ timeout: 5000 }).catch(() => errors.push('flow: typing "zuri" showed no Zuri Energy'));
  if (!page.url().includes('q=zuri')) errors.push('flow: address bar did not keep the query');
  await box.fill('goal');
  await page.getByRole('button', { name: 'Books' }).click();
  await page.getByText('The Goal').first().waitFor({ timeout: 5000 }).catch(() => errors.push('flow: Books filter lost "The Goal"'));
  await box.fill('qqqzzz');
  await page.getByText('No results for').waitFor({ timeout: 5000 }).catch(() => errors.push('flow: no-results state missing'));
  await page.getByRole('button', { name: 'Clear' }).click();
  await page.getByText('Trending this week').waitFor({ timeout: 5000 }).catch(() => errors.push('flow: Clear did not return to browse'));
  // sector link opens a search with results
  await page.getByRole('link', { name: /^Fintech/ }).click();
  await page.waitForURL(/q=Fintech/);
  await page.getByText(/result/).first().waitFor({ timeout: 5000 }).catch(() => errors.push('flow: sector link gave no results'));
  await ctx.close();
}
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`profile flow: ${e}`));
  // tabs: click and keyboard
  await page.goto(base + '/en/people/ama-boateng', { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: 'Timeline' }).click();
  await page.getByText('Joins Tema port operations').waitFor({ timeout: 5000 }).catch(() => errors.push('profile flow: Timeline tab did not show'));
  await page.getByRole('tab', { name: 'Timeline' }).press('ArrowRight');
  if ((await page.getByRole('tab', { selected: true }).textContent()) !== 'Books') errors.push('profile flow: ArrowRight did not move to Books');
  // follow toggles
  const follow = page.getByRole('button', { name: 'Follow' });
  await follow.click();
  if ((await page.getByRole('button', { name: 'Following' }).getAttribute('aria-pressed')) !== 'true') errors.push('profile flow: Following not pressed');
  // intro link
  await page.getByRole('link', { name: 'Request intro' }).waitFor({ timeout: 2000 }).catch(() => errors.push('profile flow: Request intro missing for claimed profile'));
  // unclaimed: banner, suggest
  await page.goto(base + '/en/people/priya-raman', { waitUntil: 'networkidle' });
  if (await page.getByRole('link', { name: 'Request intro' }).count()) errors.push('profile flow: unclaimed profile shows Request intro');
  await page.getByRole('button', { name: 'Suggest an edit' }).click();
  await page.getByText('Thanks. Our editors will review your suggestion.').waitFor({ timeout: 2000 }).catch(() => errors.push('profile flow: suggest confirmation missing'));
  // company -> leader -> person
  await page.goto(base + '/en/companies/kora-freight', { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: /Joel Asante/ }).click();
  await page.waitForURL(/people\/joel-asante/);
  await page.getByText('CTO, Kora Freight').first().waitFor({ timeout: 5000 }).catch(() => errors.push('profile flow: leader link did not open Joel'));
  // search result -> profile
  await page.goto(base + '/en/explore?q=nakala', { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: /Nakala/ }).first().click();
  await page.waitForURL(/companies\/nakala/);
  await page.getByText('Freight marketplace').first().waitFor({ timeout: 5000 }).catch(() => errors.push('profile flow: Nakala profile did not open'));
  await ctx.close();
}
await browser.close();
console.log('ERRORS', JSON.stringify(errors));
