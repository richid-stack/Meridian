import type { Home } from '@meridian/contracts';

// Fictional sample data (see prototype HANDOVER section 7). Never real people or companies.
export const homeFixture: Home = {
  markets: {
    isSample: true,
    ticks: [
      { id: 'gse', label: 'GSE Composite', value: 6412, decimals: 0, changePct: 0.84, series: [16, 14, 15, 9, 7, 3].map((y) => 20 - y) },
      { id: 'usdghs', label: 'USD/GHS', value: 12.18, decimals: 2, changePct: -0.31, series: [4, 6, 5, 11, 13, 16].map((y) => 20 - y) },
      { id: 'ngx', label: 'NGX All-Share', value: 121540, decimals: 0, changePct: 0.42, series: [15, 16, 11, 12, 7, 6].map((y) => 20 - y) },
      { id: 'cocoa', label: 'Cocoa', value: 7860, decimals: 0, changePct: 1.9, series: [17, 15, 12, 10, 6, 2].map((y) => 20 - y) },
      { id: 'gold', label: 'Gold', value: 2684, decimals: 0, changePct: -0.12, series: [6, 5, 9, 8, 12, 11].map((y) => 20 - y) },
    ],
  },
  lead: {
    id: 'continental-payments-rail',
    title: "The quiet race to build Africa's first continental payments rail",
    author: 'Meridian Desk',
    readMinutes: 6,
    brief: [
      'Three fintechs are now competing for one cross-border standard.',
      'Central banks are watching, and two have signalled support.',
      'The winner could cut remittance costs by a third.',
    ],
  },
  people: [
    { id: 'ama-boateng', name: 'Ama Boateng', role: 'Founder, Kora Freight' },
    { id: 'kunle-okafor', name: 'Kunle Okafor', role: 'Partner, Sahel Ventures' },
    { id: 'nia-mensah', name: 'Nia Mensah', role: 'CEO, Aya Health' },
    { id: 'tunde-dlamini', name: 'Tunde Dlamini', role: 'CFO, Zuri Energy' },
  ],
  forYou: [
    { kind: 'raise', id: 'aya-health-seed', title: 'Aya Health opens a $2M seed round for rural clinics', backers: 38, raisedMinor: 128_000_000, targetMinor: 200_000_000, currency: 'USD', daysLeft: 11 },
    { kind: 'interview', id: 'empty-trucks', title: 'Why empty trucks cost Africa billions', guest: 'Ama Boateng', minutes: 48 },
    { kind: 'book', id: 'zero-to-one', title: 'Zero to One', author: 'Peter Thiel', readers: 412, spine: '#1F4E79' },
    { kind: 'question', id: 'pricing-cedis-dollars', title: 'How do you price a product when your customers pay in cedis but your costs are in dollars?', replies: 86, topAnswerBy: 'Kunle Okafor' },
  ],
};
