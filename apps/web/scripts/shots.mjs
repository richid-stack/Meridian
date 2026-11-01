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
  ['news', '/en/news', 'Top stories'],
  ['news-fr', '/fr/news', '\u00c0 la une'],
  ['story', '/en/news/kora-abidjan-corridor', 'Mentioned'],
  ['story-fr', '/en/news/freight-gains-ground', 'Translate to English'],
  ['story-ai', '/en/news/commodity-prices-ease', 'Why it matters for African readers'],
  ['community', '/en/community', 'Building a logistics network across borders'],
  ['community-fr', '/fr/community', 'En direct'],
  ['community-following', '/en/community?tab=following', 'Nia Mensah'],
  ['community-groups', '/en/community?tab=groups', 'Your groups'],
  ['group', '/en/groups/logistics', 'Recent posts'],
  ['compose', '/en/compose', 'New post'],
  ['compose-share', '/en/compose?story=kora-abidjan-corridor', 'Kora Freight opens its Abidjan corridor'],
  ['group-404', '/en/groups/nobody', 'We could not find that page'],
  ['capital', '/en/capital', 'How community rounds work'],
  ['capital-fr', '/fr/capital', 'Comment fonctionnent les tours communautaires'],
  ['capital-closed', '/en/capital?filter=closed', 'No closed rounds yet'],
  ['deal', '/en/capital/deals/aya-health-seed', 'Due diligence summary', 'focus'],
  ['deal-fr', '/fr/capital/deals/kora-freight-round', 'Synth\u00e8se de v\u00e9rification', 'focus'],
  ['deal-404', '/en/capital/deals/nobody', 'We could not find that page', 'focus'],
  ['invest', '/en/capital/deals/aya-health-seed/invest?amount=500', 'Invest in Aya Health', 'focus'],
  ['invest-fr', '/fr/capital/deals/zuri-energy-round/invest', 'Investir dans Zuri Energy', 'focus'],
  ['portfolio', '/en/portfolio', 'Allocation by sector'],
  ['portfolio-fr', '/fr/portfolio', 'R\u00e9partition par secteur'],
  ['watchlist', '/en/watchlist', 'Notify me about updates'],
  ['compare', '/en/compare', 'Comparison summary'],
  ['compare-fr', '/fr/compare?a=zuri-energy-round&b=aya-health-seed', 'Synth\u00e8se de la comparaison'],
];
const sizes = [[390, 844], [360, 800], [1280, 800]];
const browser = await chromium.launch();
const errors = [];
for (const [name, path, mustSee, kind] of pages) {
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
        const wantNavs = kind === 'focus' ? 0 : 1;
        if (navs !== wantNavs) errors.push(`expected ${wantNavs} visible nav, got ${navs}: ${name} ${w}`);
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
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`news flow: ${e}`));
  // filter by topic through the URL
  await page.goto(base + '/en/news', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Fintech' }).click();
  await page.waitForURL(/topic=fintech/);
  await page.getByText('Mobile money transfers pass a new monthly record').first().waitFor({ timeout: 5000 }).catch(() => errors.push('news flow: topic filter did not show fintech stories'));
  if (await page.getByText('Solar-powered clinics reach rural districts').count()) errors.push('news flow: health story shown under Fintech');
  if ((await page.getByRole('button', { name: 'Fintech' }).getAttribute('aria-pressed')) !== 'true') errors.push('news flow: Fintech chip not pressed');
  // load more
  await page.goto(base + '/en/news', { waitUntil: 'networkidle' });
  const before = await page.locator('main a[href*="/news/"]').count();
  await page.getByRole('link', { name: 'Load more' }).click();
  await page.waitForURL(/page=2/);
  await page.waitForFunction((n) => document.querySelectorAll('main a[href*="/news/"]').length > n, before, { timeout: 5000 }).catch(() => errors.push('news flow: Load more added no stories'));
  // empty state and clear
  await page.goto(base + '/en/news?region=south&topic=tech', { waitUntil: 'networkidle' });
  await page.getByText('No stories here right now').waitFor({ timeout: 5000 }).catch(() => errors.push('news flow: empty state missing'));
  await page.getByRole('link', { name: 'Clear filters' }).click();
  await page.getByText('Top stories').first().waitFor({ timeout: 5000 });
  // bad filter values do not break the page
  await page.goto(base + '/en/news?region=mars&page=-1', { waitUntil: 'networkidle' });
  await page.getByText('Top stories').first().waitFor({ timeout: 5000 }).catch(() => errors.push('news flow: bad query broke the page'));
  // open a story, then a mentioned company
  await page.getByRole('link', { name: /Kora Freight opens its Abidjan corridor/ }).first().click();
  await page.waitForURL(/news\/kora-abidjan-corridor/);
  await page.getByRole('heading', { name: 'Coverage from' , exact: false }).waitFor({ timeout: 5000 }).catch(() => errors.push('news flow: coverage list missing'));
  await page.getByRole('link', { name: /Company\s*Kora Freight/ }).click();
  await page.waitForURL(/companies\/kora-freight/);
  // translate toggle
  await page.goto(base + '/en/news/freight-gains-ground', { waitUntil: 'networkidle' });
  await page.getByRole('heading', { level: 1, name: /Le fret transfrontalier/ }).waitFor({ timeout: 5000 }).catch(() => errors.push('news flow: original title missing'));
  await page.getByRole('button', { name: 'Translate to English' }).click();
  await page.getByRole('heading', { level: 1, name: 'Cross-border freight gains ground in West Africa' }).waitFor({ timeout: 5000 }).catch(() => errors.push('news flow: translation not shown'));
  await page.getByText('Translated by Meridian AI').waitFor({ timeout: 2000 }).catch(() => errors.push('news flow: AI translation label missing'));
  // report a problem
  await page.getByRole('button', { name: 'Report a problem' }).click();
  await page.getByText('Thanks, we will review this.').waitFor({ timeout: 2000 }).catch(() => errors.push('news flow: report confirmation missing'));
  // external link is safe
  const rel = await page.getByRole('link', { name: /Read at/ }).getAttribute('rel');
  if (!rel || !rel.includes('noopener')) errors.push('news flow: external link lacks noopener');
  // Home lead story and company news now resolve
  await page.goto(base + '/en/news/continental-payments-rail', { waitUntil: 'networkidle' });
  await page.getByRole('heading', { level: 1, name: /continental payments rail/ }).waitFor({ timeout: 5000 }).catch(() => errors.push('news flow: Home lead story did not open'));
  await ctx.close();
}
// ---- community flows: each one starts with empty browser storage
const fresh = async (label) => {
  const c = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const pg = await c.newPage();
  pg.on('pageerror', (e) => errors.push(`${label}: ${e}`));
  return { c, pg };
};
const need = async (loc, msg, ms = 5000) => { await loc.waitFor({ timeout: ms }).catch(() => errors.push(msg)); };
{
  const { c, pg } = await fresh('community flow');
  await pg.goto(base + '/en/community', { waitUntil: 'networkidle' });
  const href = await pg.getByRole('link', { name: /Building a logistics network/ }).getAttribute('href');
  if (href !== '/en/live/building-across-borders') errors.push(`community flow: live card links to ${href}`);
  // like, then reload
  await pg.getByRole('button', { name: /^Like: 340 likes/ }).click();
  await need(pg.getByRole('button', { name: /^Like: 341 likes/ }), 'community flow: like did not count');
  if ((await pg.getByRole('button', { name: /^Like: 341 likes/ }).getAttribute('aria-pressed')) !== 'true') errors.push('community flow: like not pressed');
  await pg.reload({ waitUntil: 'networkidle' });
  await need(pg.getByRole('button', { name: /^Like: 341 likes/ }), 'community flow: like lost after reload');
  await pg.getByRole('button', { name: /^Like: 341 likes/ }).click();
  await need(pg.getByRole('button', { name: /^Like: 340 likes/ }), 'community flow: unlike did not count');
  // poll: results hidden until you vote
  await need(pg.getByText('1,204 votes. Vote to see results.'), 'community flow: poll hint missing');
  if (await pg.getByText('41%').count()) errors.push('community flow: poll results shown before voting');
  await pg.getByRole('button', { name: 'Currency risk' }).click();
  await need(pg.getByText('1,205 votes. Thanks for voting.'), 'community flow: vote did not count');
  const top = await pg.getByRole('button', { name: /Access to capital/ }).textContent();
  if (!top.includes('41%')) errors.push(`community flow: expected 41% for Access to capital, got ${top}`);
  if (await pg.getByRole('button', { name: /Access to capital/ }).isEnabled()) errors.push('community flow: poll allows a second vote');
  await pg.reload({ waitUntil: 'networkidle' });
  await need(pg.getByText('1,205 votes. Thanks for voting.'), 'community flow: vote lost after reload');
  // tabs
  await pg.getByRole('link', { name: 'Following' }).click();
  await pg.waitForURL(/tab=following/);
  await need(pg.getByText('We spent 14 months building'), 'community flow: Following lacks a followed person');
  if (await pg.getByText('How do you price a product').count()) errors.push('community flow: Following shows someone not followed');
  if ((await pg.getByRole('link', { name: 'Following' }).getAttribute('aria-current')) !== 'page') errors.push('community flow: Following tab not current');
  // groups: join moves a group up, and is remembered
  await pg.getByRole('link', { name: 'Groups' }).click();
  await pg.waitForURL(/tab=groups/);
  const mine = pg.getByRole('region', { name: 'Your groups' });
  await need(mine.getByText('Logistics and supply chain'), 'community flow: joined group missing from Your groups');
  if (await mine.getByText('Fintech founders under 40').count()) errors.push('community flow: Fintech already joined');
  await pg.getByRole('button', { name: /^Join: Fintech founders/ }).click();
  await need(mine.getByText('Fintech founders under 40'), 'community flow: join did not move the group');
  await pg.reload({ waitUntil: 'networkidle' });
  await need(pg.getByRole('region', { name: 'Your groups' }).getByText('Fintech founders under 40'), 'community flow: join lost after reload');
  const angels = pg.getByRole('button', { name: /Angel investors circle/ });
  if (!(await angels.isDisabled())) errors.push('community flow: restricted group can be joined');
  await need(pg.getByText('Verified investors only'), 'community flow: restricted note missing');
  // group page
  await pg.getByRole('link', { name: 'Logistics and supply chain' }).first().click();
  await pg.waitForURL(/groups\/logistics/);
  await need(pg.getByText('2,418 members'), 'community flow: member count missing');
  await pg.getByRole('button', { name: 'Joined' }).click();
  await need(pg.getByText('2,417 members'), 'community flow: leaving did not update the count');
  await need(pg.getByRole('button', { name: 'Join group' }), 'community flow: button did not flip to Join group');
  await c.close();
}
{
  const { c, pg } = await fresh('compose flow');
  await pg.goto(base + '/en/community', { waitUntil: 'networkidle' });
  await pg.getByRole('link', { name: 'New post' }).click();
  await pg.waitForURL(/\/compose/);
  const post = pg.getByRole('button', { name: 'Post', exact: true });
  const box = pg.getByRole('textbox', { name: 'Post text' });
  if (!(await post.isDisabled())) errors.push('compose flow: Post enabled with no text');
  await box.fill('Cold chain is a logistics problem first.');
  if (!(await post.isEnabled())) errors.push('compose flow: Post disabled with text');
  await pg.getByRole('button', { name: 'Poll' }).click();
  if (!(await post.isDisabled())) errors.push('compose flow: poll postable without options');
  await pg.getByRole('textbox', { name: 'Option 1' }).fill('Yes');
  await pg.getByRole('textbox', { name: 'Option 2' }).fill('No');
  if (!(await post.isEnabled())) errors.push('compose flow: poll with two options not postable');
  await pg.getByRole('button', { name: 'Add option' }).click();
  await need(pg.getByRole('textbox', { name: 'Option 3' }), 'compose flow: Add option did nothing');
  await pg.getByRole('button', { name: 'Insight' }).click();
  // attach a deal, try to promise returns
  await pg.getByRole('button', { name: 'Deal', exact: true }).click();
  await pg.getByRole('button', { name: /Aya Health seed round/ }).click();
  await need(pg.getByRole('button', { name: 'Remove attachment' }), 'compose flow: attachment not shown');
  await box.fill('Guaranteed returns for every backer');
  await need(pg.getByText('This post promises returns.'), 'compose flow: return promise not flagged');
  if (!(await post.isDisabled())) errors.push('compose flow: return promise can be posted');
  await box.fill('Backing the founders, with eyes open about the risk.');
  if (!(await post.isEnabled())) errors.push('compose flow: clean deal post blocked');
  await post.click();
  await pg.waitForURL(/\/en\/community$/);
  await need(pg.getByText('Backing the founders, with eyes open about the risk.'), 'compose flow: new post missing from the feed');
  await need(pg.getByRole('link', { name: /Aya Health seed round/ }).first(), 'compose flow: attachment missing on the post');
  await pg.reload({ waitUntil: 'networkidle' });
  await need(pg.getByText('Backing the founders, with eyes open about the risk.'), 'compose flow: new post lost after reload');
  // own post can be liked
  await pg.getByRole('button', { name: /^Like: 0 likes/ }).first().click();
  await need(pg.getByRole('button', { name: /^Like: 1 like/ }).first(), 'compose flow: liking own post failed');
  await c.close();
}
{
  const { c, pg } = await fresh('compose poll flow');
  await pg.goto(base + '/en/compose', { waitUntil: 'networkidle' });
  await pg.getByRole('button', { name: 'Poll' }).click();
  await pg.getByRole('textbox', { name: 'Post text' }).fill('Ready to ship?');
  await pg.getByRole('textbox', { name: 'Option 1' }).fill('Yes');
  await pg.getByRole('textbox', { name: 'Option 2' }).fill('Not yet');
  await pg.getByRole('button', { name: 'Post', exact: true }).click();
  await pg.waitForURL(/\/en\/community$/);
  await need(pg.getByText('Ready to ship?'), 'compose poll flow: poll missing from the feed');
  await pg.getByRole('button', { name: 'Not yet' }).click();
  await need(pg.getByText('1 vote. Thanks for voting.'), 'compose poll flow: voting on own poll failed');
  await c.close();
}
{
  const { c, pg } = await fresh('discard flow');
  // Cancel goes back to where the person came from, so start from the feed like a real visit.
  await pg.goto(base + '/en/community', { waitUntil: 'networkidle' });
  await pg.getByRole('link', { name: 'New post' }).click();
  await pg.waitForURL(/\/compose/);
  await pg.getByRole('button', { name: 'Cancel' }).click();
  await pg.waitForURL(/\/en\/community$/);
  await pg.getByRole('link', { name: 'New post' }).click();
  await pg.waitForURL(/\/compose/);
  await pg.getByRole('textbox', { name: 'Post text' }).fill('Half a thought');
  await pg.getByRole('button', { name: 'Cancel' }).click();
  await need(pg.getByText('Discard this post?'), 'discard flow: confirmation missing');
  await pg.getByRole('button', { name: 'Keep editing' }).click();
  if (await pg.getByText('Discard this post?').count()) errors.push('discard flow: Keep editing did not close the confirmation');
  if ((await pg.getByRole('textbox', { name: 'Post text' }).inputValue()) !== 'Half a thought') errors.push('discard flow: text lost');
  await pg.getByRole('button', { name: 'Cancel' }).click();
  await pg.getByRole('button', { name: 'Discard' }).click();
  await pg.waitForURL(/\/en\/community$/);
  if (await pg.getByText('Half a thought').count()) errors.push('discard flow: discarded post appeared');
  await c.close();
}
{
  const { c, pg } = await fresh('group post flow');
  await pg.goto(base + '/en/compose?group=logistics', { waitUntil: 'networkidle' });
  if ((await pg.getByLabel('Audience').inputValue()) !== 'group:logistics') errors.push('group post flow: audience not preselected');
  await pg.getByRole('textbox', { name: 'Post text' }).fill('Takoradi customs update for the group.');
  await pg.getByRole('button', { name: 'Post', exact: true }).click();
  await pg.waitForURL(/groups\/logistics/);
  await need(pg.getByText('Takoradi customs update for the group.'), 'group post flow: post missing from the group');
  await pg.goto(base + '/en/community', { waitUntil: 'networkidle' });
  if (await pg.getByText('Takoradi customs update for the group.').count()) errors.push('group post flow: group post leaked into For you');
  await c.close();
}
{
  const { c, pg } = await fresh('share flow');
  await pg.goto(base + '/en/news/kora-abidjan-corridor', { waitUntil: 'networkidle' });
  await pg.getByRole('link', { name: 'Share to community' }).click();
  await pg.waitForURL(/compose\?story=kora-abidjan-corridor/);
  await need(pg.getByRole('button', { name: 'Remove attachment' }), 'share flow: story not attached');
  await pg.getByRole('textbox', { name: 'Post text' }).fill('Worth reading: a third corridor.');
  await pg.getByRole('button', { name: 'Post', exact: true }).click();
  await pg.waitForURL(/\/en\/community$/);
  const link = pg.locator('a[href="/en/news/kora-abidjan-corridor"]').first();
  await need(link, 'share flow: story card missing on the post');
  await link.click();
  await pg.waitForURL(/news\/kora-abidjan-corridor/);
  // unknown story id is ignored, not an error page
  await pg.goto(base + '/en/compose?story=nope', { waitUntil: 'networkidle' });
  await need(pg.getByRole('textbox', { name: 'Post text' }), 'share flow: bad story id broke compose');
  await c.close();
}
// ---- Capital flows
{
  const { c, pg } = await fresh('capital filters');
  await pg.goto(base + '/en/capital', { waitUntil: 'networkidle' });
  for (const n of ['Aya Health', 'Kora Freight', 'Zuri Energy']) await need(pg.getByRole('heading', { name: n }), `capital filters: ${n} missing from All open`);
  await pg.getByRole('button', { name: 'Closing soon' }).click();
  await pg.waitForURL(/filter=soon/);
  await need(pg.getByRole('heading', { name: 'Aya Health' }), 'capital filters: Closing soon lost Aya Health');
  if (await pg.getByRole('heading', { name: 'Kora Freight' }).count()) errors.push('capital filters: Closing soon still shows Kora Freight');
  await pg.getByRole('button', { name: 'New', exact: true }).click();
  await need(pg.getByRole('heading', { name: 'Zuri Energy' }), 'capital filters: New lost Zuri Energy');
  if (await pg.getByRole('heading', { name: 'Aya Health' }).count()) errors.push('capital filters: New still shows Aya Health');
  await pg.getByRole('button', { name: 'Closed', exact: true }).click();
  await need(pg.getByText('No closed rounds yet'), 'capital filters: closed empty state missing');
  await pg.getByRole('link', { name: 'See open rounds' }).click();
  await need(pg.getByRole('heading', { name: 'Kora Freight' }), 'capital filters: See open rounds did not return to the list');
  await pg.getByRole('heading', { name: 'Kora Freight' }).click();
  await pg.waitForURL(/capital\/deals\/kora-freight-round/);
  await c.close();
}
{
  const { c, pg } = await fresh('watch flow');
  await pg.goto(base + '/en/capital/deals/zuri-energy-round', { waitUntil: 'networkidle' });
  await pg.getByRole('button', { name: 'Stop watching this round' }).click();
  await need(pg.getByRole('button', { name: 'Watch this round' }), 'watch flow: bookmark did not change');
  await pg.reload({ waitUntil: 'networkidle' });
  await need(pg.getByRole('button', { name: 'Watch this round' }), 'watch flow: unwatch lost after reload');
  await pg.goto(base + '/en/watchlist', { waitUntil: 'networkidle' });
  await need(pg.getByRole('heading', { name: 'Aya Health' }), 'watch flow: Aya Health missing from the watchlist');
  if (await pg.getByRole('heading', { name: 'Zuri Energy' }).count()) errors.push('watch flow: unwatched round still on the watchlist');
  await pg.goto(base + '/en/capital', { waitUntil: 'networkidle' });
  await need(pg.locator('div:has(> dt:text-is("Watching")) > dd:text-is("2")'), 'watch flow: Watching count on Capital did not drop to 2');
  await pg.goto(base + '/en/watchlist', { waitUntil: 'networkidle' });
  await pg.getByRole('button', { name: 'Stop watching Kora Freight' }).click();
  await pg.getByRole('button', { name: 'Stop watching Aya Health' }).click();
  await need(pg.getByText('Nothing on your watchlist'), 'watch flow: empty watchlist state missing');
  await pg.reload({ waitUntil: 'networkidle' });
  await need(pg.getByText('Nothing on your watchlist'), 'watch flow: empty watchlist lost after reload');
  await c.close();
}
{
  const { c, pg } = await fresh('alerts flow');
  await pg.goto(base + '/en/watchlist', { waitUntil: 'networkidle' });
  const sw = pg.getByRole('switch', { name: 'Notify me about updates' });
  if ((await sw.getAttribute('aria-checked')) !== 'true') errors.push('alerts flow: alerts should start on');
  await sw.click();
  if ((await sw.getAttribute('aria-checked')) !== 'false') errors.push('alerts flow: switch did not turn off');
  await pg.reload({ waitUntil: 'networkidle' });
  if ((await pg.getByRole('switch', { name: 'Notify me about updates' }).getAttribute('aria-checked')) !== 'false') errors.push('alerts flow: setting lost after reload');
  await c.close();
}
{
  const { c, pg } = await fresh('invest flow');
  await pg.goto(base + '/en/capital/deals/zuri-energy-round', { waitUntil: 'networkidle' });
  await pg.getByRole('button', { name: '$500' }).click();
  await pg.getByRole('link', { name: 'Continue with $500' }).click();
  await pg.waitForURL(/invest\?amount=500/);
  const go = pg.getByRole('button', { name: 'Continue', exact: true });
  if (await go.isEnabled()) errors.push('invest flow: Continue enabled before the acknowledgements');
  const amt = pg.getByRole('textbox', { name: 'Amount in dollars' });
  await amt.fill('50');
  await need(pg.getByText('Enter at least $100.'), 'invest flow: minimum message missing');
  await amt.fill('500');
  for (const l of ['I understand I could lose all of this investment.', 'I understand this investment is illiquid and may not be sold for years.']) await pg.getByLabel(l).check();
  if (await go.isEnabled()) errors.push('invest flow: Continue enabled with two of three acknowledgements');
  await pg.getByLabel('I have read the investment terms and the due diligence summary.').check();
  await need(pg.getByText('$10', { exact: true }), 'invest flow: fee line missing');
  await go.click();
  await need(pg.getByRole('heading', { name: 'How do you want to pay?' }), 'invest flow: payment step missing');
  if (await pg.getByRole('button', { name: 'Continue', exact: true }).isEnabled()) errors.push('invest flow: Continue enabled with no payment method');
  await pg.getByLabel('Mobile money').check();
  await pg.getByRole('button', { name: 'MTN MoMo' }).click();
  await pg.getByLabel('Mobile money number').fill('123');
  await pg.getByLabel('Mobile money number').blur();
  await need(pg.getByText('Enter a 10-digit number starting with 0.'), 'invest flow: bad number message missing');
  if (await pg.getByRole('button', { name: 'Continue', exact: true }).isEnabled()) errors.push('invest flow: Continue enabled with a bad number');
  await pg.getByLabel('Mobile money number').fill('024 123 4567');
  await pg.getByRole('button', { name: 'Continue', exact: true }).click();
  await need(pg.getByRole('heading', { name: 'Confirm your investment' }), 'invest flow: confirm step missing');
  await need(pg.getByText('$510', { exact: true }), 'invest flow: total on confirm wrong');
  // back keeps what was typed
  await pg.getByRole('button', { name: 'Back' }).click();
  if ((await pg.getByLabel('Mobile money number').inputValue()) !== '024 123 4567') errors.push('invest flow: number lost on Back');
  await pg.getByRole('button', { name: 'Continue', exact: true }).click();
  await pg.getByRole('button', { name: 'Confirm and pay $510' }).click();
  await need(pg.getByRole('heading', { name: 'Approve on your phone' }), 'invest flow: processing screen missing');
  await need(pg.getByRole('heading', { name: 'Commitment received' }), 'invest flow: receipt missing', 8000);
  await need(pg.getByText(/Reference MRD-[0-9A-F]{6}/), 'invest flow: reference missing');
  await pg.getByRole('link', { name: 'View portfolio' }).click();
  await pg.waitForURL(/\/en\/portfolio/);
  await need(pg.getByText('$1,250', { exact: true }), 'invest flow: portfolio total did not become $1,250');
  await need(pg.getByText('Committed $500 in Zuri Energy'), 'invest flow: activity line missing');
  await pg.getByRole('button', { name: 'Details for Zuri Energy' }).click();
  await need(pg.getByRole('link', { name: 'View round' }), 'invest flow: position did not expand');
  await pg.reload({ waitUntil: 'networkidle' });
  await need(pg.getByText('$1,250', { exact: true }), 'invest flow: commitment lost after reload');
  await pg.goto(base + '/en/capital', { waitUntil: 'networkidle' });
  await need(pg.locator('dd', { hasText: /^\$1,250$/ }), 'invest flow: Capital summary did not update');
  await c.close();
}
{
  const { c, pg } = await fresh('invest again flow');
  await pg.goto(base + '/en/capital/deals/aya-health-seed/invest?amount=100', { waitUntil: 'networkidle' });
  for (const l of ['I understand I could lose all of this investment.', 'I understand this investment is illiquid and may not be sold for years.', 'I have read the investment terms and the due diligence summary.']) await pg.getByLabel(l).check();
  await pg.getByRole('button', { name: 'Continue', exact: true }).click();
  await pg.getByLabel('Card').check();
  await pg.getByRole('button', { name: 'Continue', exact: true }).click();
  await pg.getByRole('button', { name: 'Confirm and pay $102' }).click();
  await need(pg.getByRole('heading', { name: 'Commitment received' }), 'invest again flow: receipt missing', 8000);
  await pg.goto(base + '/en/portfolio', { waitUntil: 'networkidle' });
  await need(pg.getByText('$850', { exact: true }), 'invest again flow: same round did not add to the position ($850)');
  await need(pg.getByText('2 rounds'), 'invest again flow: adding to a round created a second position');
  await c.close();
}
{
  const { c, pg } = await fresh('decline flow');
  await pg.goto(base + '/en/capital/deals/aya-health-seed/invest', { waitUntil: 'networkidle' });
  for (const l of ['I understand I could lose all of this investment.', 'I understand this investment is illiquid and may not be sold for years.', 'I have read the investment terms and the due diligence summary.']) await pg.getByLabel(l).check();
  await pg.getByRole('button', { name: 'Continue', exact: true }).click();
  await pg.getByLabel('Mobile money').check();
  await pg.getByRole('button', { name: 'Telecel Cash' }).click();
  await pg.getByLabel('Mobile money number').fill('0240000000');
  await pg.getByRole('button', { name: 'Continue', exact: true }).click();
  await pg.getByRole('button', { name: /^Confirm and pay/ }).click();
  await need(pg.getByText('Payment not completed'), 'decline flow: decline screen missing', 8000);
  await pg.getByRole('button', { name: 'Change payment method' }).click();
  await need(pg.getByRole('heading', { name: 'How do you want to pay?' }), 'decline flow: Change payment method did not go to payment');
  await pg.getByLabel('Card').check();
  await pg.getByRole('button', { name: 'Continue', exact: true }).click();
  await pg.getByRole('button', { name: /^Confirm and pay/ }).click();
  await need(pg.getByRole('heading', { name: 'Commitment received' }), 'decline flow: paying by card after a decline failed', 8000);
  await c.close();
}
{
  const { c, pg } = await fresh('offline flow');
  await pg.goto(base + '/en/capital/deals/aya-health-seed/invest', { waitUntil: 'networkidle' });
  for (const l of ['I understand I could lose all of this investment.', 'I understand this investment is illiquid and may not be sold for years.', 'I have read the investment terms and the due diligence summary.']) await pg.getByLabel(l).check();
  await pg.getByRole('button', { name: 'Continue', exact: true }).click();
  await pg.getByLabel('Card').check();
  await pg.getByRole('button', { name: 'Continue', exact: true }).click();
  await c.setOffline(true);
  await pg.getByRole('button', { name: /^Confirm and pay/ }).click();
  await need(pg.getByText('You are offline', { exact: false }).first(), 'offline flow: offline message missing');
  await c.setOffline(false);
  await pg.getByRole('button', { name: 'Try again' }).click();
  await pg.getByRole('button', { name: /^Confirm and pay/ }).click();
  await need(pg.getByRole('heading', { name: 'Commitment received' }), 'offline flow: retry after reconnecting failed', 8000);
  await c.close();
}
{
  const { c, pg } = await fresh('compare flow');
  await pg.goto(base + '/en/compare', { waitUntil: 'networkidle' });
  await need(pg.getByRole('columnheader', { name: 'Kora Freight' }), 'compare flow: default pair missing');
  await pg.getByRole('group', { name: 'Round A' }).getByRole('button', { name: 'Zuri Energy' }).click();
  await pg.waitForURL(/a=zuri-energy-round/);
  await need(pg.getByRole('columnheader', { name: 'Zuri Energy' }), 'compare flow: Round A did not change');
  await pg.getByRole('group', { name: 'Round B' }).getByRole('button', { name: 'Zuri Energy' }).click();
  await pg.waitForURL(/a=kora-freight-round&b=zuri-energy-round|b=zuri-energy-round/);
  const heads = await pg.getByRole('columnheader').allInnerTexts();
  if (new Set(heads.filter((h) => h.trim())).size !== 2) errors.push(`compare flow: both columns show the same round: ${heads.join(',')}`);
  await need(pg.getByText('Not investment advice.', { exact: false }).first(), 'compare flow: summary note missing');
  await pg.goto(base + '/en/compare?a=nope&b=nope', { waitUntil: 'networkidle' });
  await need(pg.getByRole('columnheader', { name: 'Aya Health' }), 'compare flow: bad ids did not fall back');
  await c.close();
}
await browser.close();
console.log('ERRORS', JSON.stringify(errors));
