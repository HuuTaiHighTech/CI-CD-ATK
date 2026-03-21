import {
   Building,
   Flame,
   Gauge,
   Globe,
   Handshake,
   Layers2,
   MessageCircle,
   Newspaper,
   Package,
   Pin,
   Settings,
   ShieldCheck,
   Tag,
   UserCog,
   Wallpaper
} from 'lucide-react';
import { ROUTES } from '~/constants';
import type { NavData } from '~/types';

export const SIDEBAR_DATA: NavData = {
   nav: [
      {
         title: 'Quản lý',
         url: '#',
         items: [
            {
               icon: Gauge,
               title: 'Bảng điều khiển',
               url: ROUTES.DASHBOARD
            },
            {
               icon: Wallpaper,
               title: 'Hình ảnh',
               url: ROUTES.BANNERS
            },
            {
               icon: Pin,
               title: 'Sản phẩm ghim',
               url: ROUTES.PINPRODUCTS
            },
            {
               icon: Flame,
               title: 'Sản phẩm nổi bật',
               url: ROUTES.TOPPRODUCTS
            },
            {
               icon: Layers2,
               title: 'Danh mục',
               url: ROUTES.CATEGORIES
            },
            {
               icon: Tag,
               title: 'Thẻ',
               url: ROUTES.TAGS
            },
            {
               icon: Package,
               title: 'Sản phẩm',
               url: ROUTES.PRODUCTS
            },
            {
               icon: Newspaper,
               title: 'Bài đăng',
               url: ROUTES.POSTS
            },
            {
               icon: Handshake,
               title: 'Đối tác',
               url: ROUTES.PARTNERS
            },
            {
               icon: Globe,
               title: 'Mạng xã hội',
               url: ROUTES.SOCIALS
            },
            {
               icon: Building,
               title: 'Dự án',
               url: ROUTES.PROJECTS
            },
            {
               icon: MessageCircle,
               title: 'Phản hồi',
               url: ROUTES.FEEDBACKS
            },
            {
               icon: ShieldCheck,
               title: 'Lợi ích',
               url: ROUTES.BENEFITS
            },
            {
               icon: UserCog,
               title: 'Người dùng',
               url: ROUTES.USERS,
               roles: ['ADMIN']
            },
            {
               icon: Settings,
               title: 'Cài đặt',
               url: ROUTES.SETTINGS
            }
         ]
      }
   ]
};
