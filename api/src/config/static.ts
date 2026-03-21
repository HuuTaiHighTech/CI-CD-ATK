import { type FastifyStaticOptions } from '@fastify/static';
import { PUBLIC_DIR } from '~/config/constants';

const staticOptions: FastifyStaticOptions = {
  root: PUBLIC_DIR,
  prefix: '/uploads',
  immutable: true,
  maxAge: '1y',
  setHeaders: (res) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader(
      'Cache-Control',
      'public, immutable, max-age=31536000, stale-while-revalidate=86400'
    );
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Timing-Allow-Origin', '*');
  }
};

export default staticOptions;
