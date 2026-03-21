import { getLocale } from '~/lib/locale';
import type { HttpOptions, HttpResponse } from '~/types';

class HttpError extends Error {
  constructor(public status: number, message: string, public data?: unknown) {
    super(message);
    this.name = 'HttpError';
  }
}

class HttpClient {
  private baseURL: string;
  private defaultTimeout: number = 10000;

  constructor() {
    const url =
      typeof window === 'undefined'
        ? process.env.BASE_URL
        : process.env.NEXT_PUBLIC_BASE_URL;

    if (!url) {
      throw new Error('BASE_URL is not defined');
    }

    this.baseURL = url.replace(/\/+$/, '') + '/api/';
  }

  private buildURL(endpoint: string, params?: Record<string, unknown>): string {
    const url = new URL(endpoint.replace(/^\/+/, ''), this.baseURL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => url.searchParams.append(key, String(v)));
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });
    }

    return url.toString();
  }

  private async getHeaders(customHeaders?: HeadersInit): Promise<HeadersInit> {
    return {
      'Content-Type': 'application/json',
      'Accept-Language': await getLocale(),
      ...customHeaders
    };
  }

  private async handleResponse<T>(
    response: Response
  ): Promise<HttpResponse<T>> {
    let data: HttpResponse<T>;

    try {
      data = await response.json();
    } catch {
      throw new HttpError(response.status, 'Invalid JSON response');
    }

    if (!response.ok) {
      throw new HttpError(data.status, data.message, data.data);
    }

    return data;
  }

  async request<T = unknown>(
    endpoint: string,
    options: HttpOptions = {}
  ): Promise<HttpResponse<T>> {
    const {
      params,
      timeout = this.defaultTimeout,
      headers,
      ...fetchOptions
    } = options;

    const url = this.buildURL(endpoint, params);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: await this.getHeaders(headers),
        signal: controller.signal
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof HttpError) throw error;

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new HttpError(408, 'Request timeout');
        }
        throw new HttpError(500, error.message);
      }

      throw new HttpError(500, 'Unknown error occurred');
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async get<T = unknown>(
    endpoint: string,
    options?: HttpOptions
  ): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: HttpOptions
  ): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined
    });
  }

  async put<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: HttpOptions
  ): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined
    });
  }

  async delete<T = unknown>(
    endpoint: string,
    options?: HttpOptions
  ): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const http = new HttpClient();
