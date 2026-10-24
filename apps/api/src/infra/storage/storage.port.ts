export interface StoragePort {
  presignUpload(key: string, mime: string, maxBytes: number): Promise<{ url: string; fields?: Record<string, string> }>;
  presignDownload(key: string, ttlSeconds: number): Promise<string>;
  remove(key: string): Promise<void>;
}
