export interface KycPort {
  start(userId: string): Promise<{ providerRef: string; url: string }>;
  status(providerRef: string): Promise<'pending' | 'approved' | 'rejected'>;
}
