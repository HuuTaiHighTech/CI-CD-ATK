import { type FastifyInstance } from 'fastify';
import controller from '~/modules/setting/controller';

async function settingRoutes(route: FastifyInstance) {
  // public routes
  route.get('/ads-image', controller.getAdsImage);
  route.get('/zalo', controller.getZalo);
  route.get('/address-image', controller.getAddressImage);
  route.get('/about-page', controller.getAboutPage);

  // protected routes (require auth + role)
  route.register(async (route) => {
    route.addHook('onRequest', route.authenticate);
    route.addHook('onRequest', route.authorize('EDITOR', 'ADMIN'));

    route.put('/ads-image', controller.updateAdsImage);
    route.put('/zalo', controller.updateZalo);
    route.put('/address-image', controller.updateAddressImage);
    route.put('/about-page', controller.updateAboutPage);
  });
}

export default settingRoutes;
