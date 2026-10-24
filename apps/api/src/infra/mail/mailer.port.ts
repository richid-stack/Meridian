export interface MailerPort {
  send(to: string, template: string, data: Record<string, unknown>): Promise<void>;
}
