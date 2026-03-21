import { type FastifyReply, type FastifyRequest } from 'fastify';
import { AnalyticsQuerySchema } from '~/modules/analytics/schema';
import service from '~/modules/analytics/service';

const analyticsController = {
  // GET /api/analytics/overview
  overview: async (request: FastifyRequest, reply: FastifyReply) => {
    const query = AnalyticsQuerySchema.parse(request.query);
    const data = await service.getOverview(query);
    return reply.json(200, 'OK', data);
  },

  // GET /api/analytics/top-pages
  topPages: async (request: FastifyRequest, reply: FastifyReply) => {
    const query = AnalyticsQuerySchema.parse(request.query);
    const data = await service.getTopPages(query);
    return reply.json(200, 'OK', data);
  },

  // GET /api/analytics/devices
  devices: async (request: FastifyRequest, reply: FastifyReply) => {
    const query = AnalyticsQuerySchema.parse(request.query);
    const data = await service.getTopDevices(query);
    return reply.json(200, 'OK', data);
  },

  // GET /api/analytics/locations
  locations: async (request: FastifyRequest, reply: FastifyReply) => {
    const query = AnalyticsQuerySchema.parse(request.query);
    const data = await service.getTopLocations(query);
    return reply.json(200, 'OK', data);
  },

  // GET /api/analytics/traffic-sources
  trafficSources: async (request: FastifyRequest, reply: FastifyReply) => {
    const query = AnalyticsQuerySchema.parse(request.query);
    const data = await service.getTrafficSources(query);
    return reply.json(200, 'OK', data);
  }
};

export default analyticsController;
