// Every AI answer must carry sources and an AI label (design rule).
export interface AiPort {
  answer(input: { question: string; context?: string[] }): Promise<{ text: string; sources: { title: string; url: string }[] }>;
}
