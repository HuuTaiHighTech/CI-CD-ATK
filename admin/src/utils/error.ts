import { AxiosError as AxiosErrorInstance } from 'axios';
import type { HttpResponse } from '~/types';

export function NotFoundResponse(message: string = 'Không tìm thấy'): never {
  throw new Response(message, { status: 404 });
}

export function ForbiddenResponse(
  message: string = 'Không có quyền truy cập'
): never {
  throw new Response(message, { status: 403 });
}

export function LoaderError(error: unknown): never {
  if (error instanceof Response) throw error;
  throw new Response('Lỗi không xác định', { status: 500 });
}

export function AxiosError(error: unknown): HttpResponse {
  if (error instanceof AxiosErrorInstance) {
    const response = error.response;

    if (response) {
      const status = response.status;
      const { message = 'Lỗi không xác định', data } = response.data;
      return {
        status,
        message,
        ...(data && { data })
      };
    }
    switch (error.code) {
      case 'NETWORK_ERROR':
        return {
          status: 0,
          message: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.'
        };
      case 'ECONNABORTED':
        return {
          status: 0,
          message: 'Kết nối quá thời gian. Vui lòng thử lại.'
        };
      case 'CANCELED':
        return {
          status: 0,
          message: 'Yêu cầu đã bị hủy.'
        };

      default:
        return {
          status: 0,
          message: 'Lỗi không xác định từ máy chủ'
        };
    }
  }

  return { message: 'Lỗi không xác định' };
}
