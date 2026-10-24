export interface PushPort {
  send(userId: string, payload: { title: string; body: string; url?: string }): Promise<void>;
}
