import { type FastifyReply, type FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { HttpException } from '~/exceptions';

export function handleError(
  error: unknown,
  request: FastifyRequest,
  reply: FastifyReply
) {
  request.log.error(error);
  if (error instanceof HttpException) {
    return reply.code(error.status).send({
      message: error.message,
      data: error.data
    });
  } else if (error instanceof ZodError) {
    const errors = error.issues.reduce((acc, issue) => {
      acc[issue.path.join('.')] = issue.message;
      return acc;
    }, {} as Record<string, string>);
    return reply.code(400).send({
      message: 'Dữ liệu gửi lên không hợp lệ',
      data: errors
    });
  }
  return reply.code(500).send({ message: 'Lỗi máy chủ nội bộ' });
}
