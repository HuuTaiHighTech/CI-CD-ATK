export class HttpException extends Error {
   status: number;
   data?: unknown;
   constructor(message: string, statusCode = 500, data?: unknown) {
      super(message);
      this.status = statusCode;
      this.data = data;
   }
}

export class BadRequestException extends HttpException {
   constructor(message = 'Yêu cầu không hợp lệ', data?: unknown) {
      super(message, 400, data);
   }
}

export class UnauthorizedException extends HttpException {
   constructor(message = 'Yêu cầu xác thực') {
      super(message, 401);
   }
}

export class ForbiddenException extends HttpException {
   constructor(message = 'Không có quyền truy cập') {
      super(message, 403);
   }
}

export class NotFoundException extends HttpException {
   constructor(message = 'Không tìm thấy') {
      super(message, 404);
   }
}

export class ConflictException extends HttpException {
   constructor(message = 'Xung đột dữ liệu') {
      super(message, 409);
   }
}

export class InternalServerErrorException extends HttpException {
   constructor(message = 'Lỗi máy chủ nội bộ') {
      super(message, 500);
   }
}
