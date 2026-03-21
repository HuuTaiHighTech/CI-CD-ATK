import { type FastifyRequest } from 'fastify';
import { type ZodSchema } from 'zod';
import { BadRequestException } from '~/exceptions';
import type { FileBuffer } from '~/types';

type MimeType = 'image/jpeg' | 'image/png' | 'image/webp';

interface MultipartOptions {
  imageRequired?: boolean;
  maxImages?: number;
  allowedMimeTypes?: MimeType[];
  maxFileSize?: number;
}

interface FormData<T> {
  data: T;
  files: FileBuffer[];
}

function isAllowedMimeType(mimetype: string, allowed: string[]): boolean {
  return allowed.some((type) => {
    if (type.endsWith('/*')) {
      return mimetype.startsWith(type.replace('/*', '/'));
    }
    return mimetype === type;
  });
}

const formData = async <T>(
  request: FastifyRequest,
  schema: ZodSchema<T>,
  options: MultipartOptions = {}
): Promise<FormData<T>> => {
  const {
    imageRequired = false,
    maxImages = 10,
    allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize = 10 // 10MB
  } = options;
  const MAX_FILE_SIZE = maxFileSize * 1024 * 1024;

  if (!request.isMultipart()) {
    throw new BadRequestException('Yêu cầu phải là multipart/form-data');
  }

  let rawData: string | undefined;
  let files: FileBuffer[] = [];

  const parts = request.parts();
  for await (const part of parts) {
    if (part.type === 'file') {
      if (!isAllowedMimeType(part.mimetype, allowedMimeTypes)) {
        throw new BadRequestException(
          `File không hợp lệ. Chỉ chấp nhận: ${allowedMimeTypes.join(', ')}`
        );
      }

      if (part.file.bytesRead > MAX_FILE_SIZE) {
        throw new BadRequestException(`File quá lớn. Tối đa ${maxFileSize}MB`);
      }

      if (files.length >= maxImages) {
        throw new BadRequestException(`Tối đa ${maxImages} ảnh`);
      }

      const buffer = await part.toBuffer();
      files.push({ filename: part.filename, buffer });
    } else {
      rawData = part.value as string;
    }
  }

  if (!rawData) {
    throw new BadRequestException(`Thiếu trường data`);
  }

  let data: any;
  try {
    data = JSON.parse(rawData);
  } catch (error) {
    throw new BadRequestException('Dữ liệu JSON không hợp lệ');
  }

  if (imageRequired && files.length === 0) {
    throw new BadRequestException('File ảnh là bắt buộc');
  }

  data = schema.parse(data);
  return { data, files };
};

export default formData;
