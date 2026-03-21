import { type FastifyReply, type FastifyRequest } from 'fastify';
import service from '~/modules/auth/service';
import { SignInSchema, ProfileSchema } from '~/modules/auth/schema';
import env from '~/config/env';

const authController = {
  // GET /api/me
  me: (request: FastifyRequest, reply: FastifyReply) => {
    const { user } = request.session;
    if (!user) return reply.json(200, 'OK', null);
    return reply.json(200, 'OK', user);
  },

  // POST /api/sign-up
  signUp: async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.json(200, 'Đang phát triển...');
  },

  // POST /api/sign-in
  signIn: async (request: FastifyRequest, reply: FastifyReply) => {
    const { username, password } = SignInSchema.parse(request.body);
    const user = await service.authenticate(username, password);
    await request.session.regenerate();
    request.session.user = user;
    return reply.json(200, 'OK', user);
  },

  // PATCH /api/me
  update: async (request: FastifyRequest, reply: FastifyReply) => {
    request.assertUser();
    const { user } = request;
    const data = ProfileSchema.parse(request.body);
    const info = await service.update(user.id, data);
    request.session.user = info;
    return reply.json(200, 'Cập nhật thông tin thành công', info);
  },

  // POST /api/sign-out
  signOut: async (request: FastifyRequest, reply: FastifyReply) => {
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    await request.session.destroy();
    return reply.clearCookie(env.COOKIE_NAME).json(200, 'OK');
  }
};

export default authController;
