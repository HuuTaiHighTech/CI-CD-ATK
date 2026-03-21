import type { Role } from '~/types/auth';

export type MenuItem = {
   icon: React.ElementType;
   title: string;
   url: string;
   roles?: Role[];
};

export type NavGroup = {
   title: string;
   url: string;
   items: MenuItem[];
};

export type NavData = {
   nav: NavGroup[];
};
