import createServer from '~/server';
import { env } from '~/config';

const start = async () => {
  try {
    const { HOST, PORT } = env;
    const server = await createServer();
    await server.listen({ host: HOST, port: PORT });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
