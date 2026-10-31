import type { Explore, SearchHit } from '@meridian/contracts';
import type { entities } from '@meridian/domain';

// Fictional sample data (see prototype HANDOVER section 7). Real people and companies come from sourced data only.
export type CatalogueItem = entities.Searchable & { hit: SearchHit };

const person = (id: string, name: string, initials: string, role: string, text: string): CatalogueItem => ({
  kind: 'person', id, title: name, subtitle: role, text, boost: 1.2, hit: { kind: 'person', id, title: name, subtitle: role, initials },
});
const company = (id: string, name: string, letter: string, tag: string, text: string): CatalogueItem => ({
  kind: 'company', id, title: name, subtitle: tag, text, boost: 1.2, hit: { kind: 'company', id, title: name, subtitle: tag, initials: letter },
});
const book = (id: string, title: string, author: string, spine: string): CatalogueItem => ({
  kind: 'book', id, title, subtitle: author, text: 'book', boost: 1, hit: { kind: 'book', id, title, subtitle: author, spine },
});
const episode = (id: string, title: string, by: string, len: string, media: 'audio' | 'video', text: string): CatalogueItem => ({
  kind: 'episode', id, title, subtitle: `${by}, ${len}`, text, boost: 1, hit: { kind: 'episode', id, title, subtitle: `${by}, ${len}`, media },
});
const deal = (id: string, name: string, line: string, pct: number, text: string): CatalogueItem => ({
  kind: 'deal', id, title: `${name} round`, subtitle: line, text, boost: 1, hit: { kind: 'deal', id, title: `${name} round`, subtitle: line, pct },
});
const story = (id: string, title: string, source: string, text: string): CatalogueItem => ({
  kind: 'story', id, title, subtitle: source, text, boost: 0.9, hit: { kind: 'story', id, title, subtitle: source, initials: source.charAt(0) },
});

export const catalogue: CatalogueItem[] = [
  person('ama-boateng', 'Ama Boateng', 'AB', 'Founder and CEO, Kora Freight', 'founder logistics freight ghana accra'),
  person('nia-mensah', 'Nia Mensah', 'NM', 'CEO, Aya Health', 'health clinics solar ceo ghana'),
  person('kunle-okafor', 'Kunle Okafor', 'KO', 'Partner, Sahel Ventures', 'investor venture capital seed lagos nigeria fintech'),
  person('tunde-dlamini', 'Tunde Dlamini', 'TD', 'CFO, Zuri Energy', 'cfo finance energy solar ghana kumasi'),
  person('fatou-keita', 'Fatou Keita', 'FK', 'Head of operations, Kora Freight', 'operations logistics freight ghana'),
  person('priya-raman', 'Priya Raman', 'PR', 'CEO, Helix Semiconductors', 'chips semiconductors technology ceo singapore asia'),
  person('mateo-alvarez', 'Mateo Alvarez', 'MA', 'CEO, Lumen Grid', 'energy storage batteries utilities ceo chile americas valparaiso'),
  person('sofia-lindqvist', 'Sofia Lindqvist', 'SL', 'Founder and chair, Aurora Retail Group', 'retail delivery founder chair sweden europe'),
  company('kora-freight', 'Kora Freight', 'K', 'Digital freight network, Accra', 'logistics freight ghana accra'),
  company('nakala', 'Nakala', 'N', 'Freight marketplace, Lagos', 'logistics freight nigeria lagos'),
  company('aya-health', 'Aya Health', 'A', 'Solar-powered rural clinics, Accra', 'health clinics solar ghana'),
  company('zuri-energy', 'Zuri Energy', 'Z', 'Solar finance for small businesses, Kumasi', 'energy solar finance ghana'),
  company('helix-semiconductors', 'Helix Semiconductors', 'H', 'Low-power processors, Singapore', 'chips semiconductors technology asia'),
  company('aurora-retail-group', 'Aurora Retail Group', 'A', 'Multi-format retail and delivery, Stockholm', 'retail delivery europe'),
  company('lumen-grid', 'Lumen Grid', 'L', 'Utility-scale battery storage, Santiago', 'energy storage batteries chile americas'),
  book('zero-to-one', 'Zero to One', 'Peter Thiel', '#1F4E79'),
  book('the-goal', 'The Goal', 'Eliyahu Goldratt', '#5B3A29'),
  book('things-fall-apart', 'Things Fall Apart', 'Chinua Achebe', '#7A2E3A'),
  book('the-hard-thing', 'The Hard Thing About Hard Things', 'Ben Horowitz', '#2F5D3A'),
  episode('empty-trucks', 'Why empty trucks cost Africa billions', 'Ama Boateng', '48 min', 'audio', 'podcast logistics freight'),
  episode('building-kora', 'Building Kora from a single route', 'Ama Boateng', '32 min', 'video', 'interview logistics freight'),
  episode('payments-rail', 'Inside the race for a continental payments rail', 'Meridian Desk', '25 min', 'video', 'explainer fintech payments media'),
  deal('aya-health-seed', 'Aya Health', '$1.28M of $2M, 11 days left', 64, 'raising seed health clinics'),
  deal('kora-freight-round', 'Kora Freight', '$760K of $2M, 19 days left', 38, 'raising growth logistics freight'),
  deal('zuri-energy-round', 'Zuri Energy', '$310K of $1.5M, 26 days left', 21, 'raising growth energy solar'),
  story('continental-payments-rail', "The quiet race to build Africa's first continental payments rail", 'Meridian Desk', 'fintech payments media banks'),
  story('cocoa-harvest-estimates', 'Cocoa prices climb as harvest estimates fall', 'Accra Ledger', 'agritech cocoa farming commodities'),
  story('central-bank-payments', 'Central bank signals support for a cross-border payment standard', 'Lagos Courier', 'fintech payments banking'),
  story('kora-abidjan-corridor', 'Kora Freight opens its Abidjan corridor', 'West Africa Wire', 'logistics freight corridor'),
];

export const exploreFixture: Explore = {
  isSample: true,
  trending: [
    { kind: 'person', id: 'ama-boateng', title: 'Ama Boateng', subtitle: 'Person, Founder of Kora Freight', initials: 'AB' },
    { kind: 'company', id: 'aya-health', title: 'Aya Health', subtitle: 'Company, raising a $2M seed', initials: 'A' },
    { kind: 'book', id: 'zero-to-one', title: 'Zero to One', subtitle: 'Book, Peter Thiel', spine: '#1F4E79' },
    { kind: 'topic', id: 'cross-border-payments', title: 'Cross-border payments', subtitle: 'Topic, 214 profiles' },
  ],
  companies: catalogue.filter((c) => ['kora-freight', 'aya-health', 'zuri-energy', 'helix-semiconductors'].includes(c.id)).map((c) => c.hit),
  sectors: [
    { id: 'fintech', label: 'Fintech', count: 1204 },
    { id: 'agritech', label: 'Agritech', count: 512 },
    { id: 'logistics', label: 'Logistics', count: 388 },
    { id: 'health', label: 'Health', count: 341 },
    { id: 'energy', label: 'Energy', count: 276 },
    { id: 'media', label: 'Media', count: 190 },
  ],
  books: [
    { id: 'zero-to-one', title: 'Zero to One', author: 'Peter Thiel', spine: '#1F4E79' },
    { id: 'the-goal', title: 'The Goal', author: 'Eliyahu Goldratt', spine: '#5B3A29' },
    { id: 'things-fall-apart', title: 'Things Fall Apart', author: 'Chinua Achebe', spine: '#7A2E3A' },
    { id: 'the-hard-thing', title: 'The Hard Thing', author: 'Ben Horowitz', spine: '#2F5D3A' },
  ],
};
