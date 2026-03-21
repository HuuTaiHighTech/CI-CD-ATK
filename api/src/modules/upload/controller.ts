import { type FastifyReply, type FastifyRequest } from 'fastify';
import { cloudinary } from '~/utils';

const uploadController = {
  // POST /api/uploads
  upload: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = await request.file().catch(() => null);
      if (!data) return reply.json(400, 'Không có tệp nào được tải lên');
      if (data.file.truncated)
        return reply.json(413, 'Tệp tải lên quá lớn (tối đa 10MB)');
      const buffer = await data.toBuffer();
      const url = await cloudinary.upload({
        filename: data.filename,
        buffer
      });
      return reply.code(200).send({ url });
    } catch {
      return reply.json(500, 'Tải lên thất bại');
    } finally {
      await request.cleanRequestFiles();
    }
  }
};

export default uploadController;
