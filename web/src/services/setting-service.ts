import { http } from '~/lib/http';
import type { Setting, Zalo } from '~/types';

const settingService = {
  getAboutPage: async (): Promise<string[]> => {
    try {
      const { data } = await http.get<Setting<string[]>>(
        '/settings/about-page'
      );
      return data.value || [];
    } catch {
      return [];
    }
  },
  getAddressImage: async (): Promise<string | null> => {
    try {
      const { data } = await http.get<Setting<string>>(
        '/settings/address-image'
      );
      return data.value || null;
    } catch {
      return null;
    }
  },
  getAdsImage: async (): Promise<string | null> => {
    try {
      const { data } = await http.get<Setting<string>>('/settings/ads-image');
      return data.value || null;
    } catch {
      return null;
    }
  },
  getZalo: async (): Promise<Zalo | null> => {
    try {
      const { data } = await http.get<Setting<Zalo>>('/settings/zalo');
      return data.value || null;
    } catch {
      return null;
    }
  }
};

export default settingService;
