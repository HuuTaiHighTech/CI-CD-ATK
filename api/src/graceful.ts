import type { FastifyInstance } from 'fastify';
import { prisma } from '~/config';

const SHUTDOWN_TIMEOUT = 10000;

const registerShutdownHooks = (server: FastifyInstance) => {
  let isShuttingDown = false;

  const shutdown = async (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    server.log.info(`Received ${signal}, shutting down gracefully`);

    const timeoutId = setTimeout(() => {
      server.log.error('Shutdown timeout, forcing exit');
      process.exit(1);
    }, SHUTDOWN_TIMEOUT);

    try {
      await server.close();
      await prisma.$disconnect();
      clearTimeout(timeoutId);
      process.exit(0);
    } catch (error) {
      server.log.error(error);
      clearTimeout(timeoutId);
      process.exit(1);
    }
  };

  ['SIGINT', 'SIGTERM', 'SIGUSR2'].forEach((signal) => {
    process.on(signal, () => shutdown(signal));
  });

  process.on('uncaughtException', (error) => {
    server.log.fatal(error, 'Uncaught Exception - exiting immediately');
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    server.log.fatal({ reason }, 'Unhandled Rejection - exiting immediately');
    process.exit(1);
  });
};

export default registerShutdownHooks;
