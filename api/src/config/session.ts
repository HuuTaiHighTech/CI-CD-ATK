import { type FastifySessionOptions } from '@fastify/session';
import env from '~/config/env';

const sessionOptions: FastifySessionOptions = {
  secret: env.SESSION_SECRET,
  cookieName: env.COOKIE_NAME,
  cookie: {
    httpOnly: true,
    secure: env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: env.COOKIE_MAX_AGE
  },
  rolling: true,
  saveUninitialized: false
};

export default sessionOptions;
