// Licensed payment/investing partner sits behind this port. See docs/COMPLIANCE.md.
export interface PaymentsPort {
  createIntent(input: { userId: string; roundId: string; amountMinor: number; currency: string }): Promise<{ providerRef: string; status: string }>;
  handleWebhook(rawBody: Buffer, signature: string): Promise<void>;
}
