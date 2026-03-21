export interface HttpOptions extends RequestInit {
  params?: Record<string, unknown>;
  timeout?: number;
}

export interface HttpResponse<T = unknown> {
  status: number;
  message: string;
  data: T;
}
