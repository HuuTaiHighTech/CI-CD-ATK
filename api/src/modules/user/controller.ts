import { type FastifyReply, type FastifyRequest } from 'fastify';
import service from '~/modules/user/service';
import { UserSchema, UserQuerySchema } from '~/modules/user/schema';

const userController = {
   // GET /api/users
   get: async (request: FastifyRequest, reply: FastifyReply) => {
      const query = UserQuerySchema.parse(request.query);
      const users = await service.get(query);
      return reply.json(200, 'OK', users);
   },

   // GET /api/users/:id
   getById: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      const { id } = request.params;
      const user = service.getById(id);
      return reply.json(200, 'OK', user);
   },

   // POST /api/users
   create: async (request: FastifyRequest, reply: FastifyReply) => {
      const data = UserSchema.parse(request.body);
      const user = await service.create(data);
      return reply.json(201, 'OK', user);
   },

   // PATCH /api/users/:id
   update: async (
      request: FastifyRequest<{
         Params: { id: string };
      }>,
      reply: FastifyReply
   ) => {
      const { id } = request.params;
      const data = UserSchema.partial().parse(request.body);
      const user = await service.update(id, data);
      return reply.json(201, 'OK', user);
   },

   // DELETE /api/users/:id
   delete: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      const { id } = request.params;
      await service.delete(id);
      return reply.json(200, 'OK');
   }
};

export default userController;
