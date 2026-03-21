import { type FastifyInstance } from 'fastify';
import controller from '~/modules/auth/controller';

async function authRoutes(route: FastifyInstance) {
  route.get('/me', controller.me);
  route.post('/sign-up', controller.signUp);
  route.post(
    '/sign-in',
    {
      config: {
        rateLimit: {
          max: 20,
          timeWindow: '5 minutes',
          errorResponseBuilder: () => {
            return {
              statusCode: 429,
              error: 'Too Many Requests',
              message:
                'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau vài phút.',
            };
          },
        },
      },
    },
    controller.signIn
  );
  route.post('/sign-out', controller.signOut);

  // protected routes (require auth)
  route.register(async (route) => {
    route.addHook('onRequest', route.authenticate);

    route.patch('/me', controller.update);
  });
}

export default authRoutes;
