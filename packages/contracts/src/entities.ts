import { z } from 'zod';

const Fact = z.object({ label: z.string(), value: z.string() });
const Source = z.object({ title: z.string(), kind: z.string(), date: z.string() });
const Stat = z.object({ label: z.string(), value: z.string() });

/** Stats are display-ready text ("$180M"). Structured numbers can replace them when the M6 contract defines them. */
export const PersonProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  initials: z.string().min(1).max(3),
  role: z.string(),
  location: z.string(),
  /** Claimed by the person themselves: unlocks Message and Request intro, hides the "compiled from public sources" banner. */
  claimed: z.boolean(),
  lede: z.array(z.string()).min(1),
  facts: z.array(Fact),
  timeline: z.array(z.object({ year: z.string(), title: z.string(), detail: z.string() })),
  books: z.array(z.object({ id: z.string(), title: z.string(), author: z.string(), spine: z.string(), note: z.string().optional() })),
  interviews: z.array(z.object({ id: z.string(), title: z.string(), media: z.enum(['audio', 'video']), minutes: z.number().int() })),
  backers: z.array(z.object({ name: z.string(), role: z.string() })),
  sources: z.array(Source),
  snapshot: z.object({ title: z.string(), stage: z.string(), stats: z.array(Stat).length(4), series: z.array(z.number()).min(2), seriesLabel: z.string() }),
});
export type PersonProfile = z.infer<typeof PersonProfileSchema>;

export const CompanyProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  letter: z.string().min(1).max(2),
  tagline: z.string(),
  location: z.string(),
  claimed: z.boolean(),
  lede: z.string(),
  facts: z.array(Fact),
  stage: z.string(),
  stats: z.array(Stat).length(4),
  trend: z.array(z.object({ label: z.string(), value: z.number() })).min(2),
  unit: z.string(),
  leaders: z.array(z.object({ id: z.string(), name: z.string(), initials: z.string(), role: z.string() })),
  news: z.array(z.object({ id: z.string(), title: z.string(), source: z.string() })),
  round: z.object({ dealId: z.string(), backers: z.number().int(), raisedMinor: z.number().int(), targetMinor: z.number().int().positive(), currency: z.string().length(3) }).optional(),
  sources: z.array(Source),
});
export type CompanyProfile = z.infer<typeof CompanyProfileSchema>;
