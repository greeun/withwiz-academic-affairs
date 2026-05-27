export interface StoredObjectMeta {
  url: string;
  contentType?: string;
  size?: number;
}

export interface IObjectStorage {
  /** Persist bytes and return a public URL. Caller controls keying. */
  put(key: string, body: ArrayBuffer | Uint8Array, contentType: string): Promise<StoredObjectMeta>;
  /** Best-effort delete. Implementations should NOT throw on missing. */
  delete(key: string): Promise<void>;
}
