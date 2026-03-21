import { type FastifyInstance } from 'fastify';
import auth from '~/modules/auth/route';
import user from '~/modules/user/route';
import category from '~/modules/category/route';
import product from '~/modules/product/route';
import analytic from '~/modules/analytics/route';
import post from '~/modules/post/route';
import tag from '~/modules/tag/route';
import social from '~/modules/social/route';
import partner from '~/modules/partner/route';
import project from '~/modules/project/route';
import feedback from '~/modules/feedback/route';
import upload from '~/modules/upload/route';
import setting from '~/modules/setting/route';
import banner from '~/modules/banner/route';
import search from '~/modules/search/route';
import sheet from '~/modules/sheet/route';
import benefit from '~/modules/benefit/route';
import topProduct from '~/modules/top-product/route';
import pinProduct from '~/modules/pin-product/route';

async function routes(route: FastifyInstance) {
   route.register(auth);
   route.register(user, { prefix: '/users' });
   route.register(category, { prefix: '/categories' });
   route.register(tag, { prefix: '/tags' });
   route.register(product, { prefix: '/products' });
   route.register(topProduct, { prefix: '/top-products' });
   route.register(pinProduct, { prefix: '/pin-products' });
   route.register(post, { prefix: '/posts' });
   route.register(social, { prefix: '/socials' });
   route.register(partner, { prefix: '/partners' });
   route.register(project, { prefix: '/projects' });
   route.register(feedback, { prefix: '/feedbacks' });
   route.register(banner, { prefix: '/banners' });
   route.register(benefit, { prefix: '/benefits' });
   route.register(search, { prefix: '/search' });
   route.register(setting, { prefix: '/settings' });
   route.register(upload, { prefix: '/uploads' });
   route.register(sheet, { prefix: '/sheets' });
   route.register(analytic, { prefix: '/analytics' });
}

export default routes;
