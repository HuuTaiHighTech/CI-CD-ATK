import { type FastifyHelmetOptions } from '@fastify/helmet';
import env from '~/config/env';

const helmetOptions: FastifyHelmetOptions = {
  contentSecurityPolicy: env.NODE_ENV !== 'development',
  crossOriginEmbedderPolicy: { policy: 'require-corp' },
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: { policy: 'same-origin' },
  frameguard: { action: 'deny' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  strictTransportSecurity: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  dnsPrefetchControl: { allow: false },
  ieNoOpen: true,
  permittedCrossDomainPolicies: {
    permittedPolicies: 'none'
  },
  hidePoweredBy: true,
  xssFilter: true
};

export default helmetOptions;
