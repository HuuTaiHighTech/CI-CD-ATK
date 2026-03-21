import { type FastifyInstance } from 'fastify';
import authPlugin from '~/plugins/auth';
import contextPlugin from '~/plugins/context';
import replyPlugin from '~/plugins/reply';
import assertUserPlugin from '~/plugins/assert-user';

const registerPlugins = async (server: FastifyInstance) => {
   await server.register(replyPlugin);
   await server.register(contextPlugin);
   await server.register(authPlugin);
   await server.register(assertUserPlugin);
};

export { replyPlugin, authPlugin, contextPlugin, assertUserPlugin };
export default registerPlugins;
