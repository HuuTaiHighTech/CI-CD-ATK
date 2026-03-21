export interface Setting<T = unknown> {
  id: string;
  key: string;
  value: T;
}

export interface Zalo {
  qr?: string;
  phone?: string;
}
