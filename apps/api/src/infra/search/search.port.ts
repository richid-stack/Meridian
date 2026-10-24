export interface SearchPort {
  query(q: string, opts?: { kinds?: string[]; limit?: number }): Promise<unknown[]>;
  index(kind: string, id: string, doc: Record<string, unknown>): Promise<void>;
}
