import type { Setting } from '~/types';
import { api } from '~/utils';

const settingService = {
  getAdsImage: () => api.get<Setting>('/settings/ads-image'),
  getZalo: () => api.get<Setting>('/settings/zalo'),
  getAddressInage: () => api.get<Setting>('/settings/address-image'),
  getAboutPage: () => api.get<Setting>('/settings/about-page'),

  updateAdsImage: async (file?: File | null) => {
    const formData = new FormData();
    if (file) formData.append('file', file);
    const res = await api.put<Setting>('/settings/ads-image', formData);
    return res;
  },
  updateZalo: async (file?: File | null, phone?: string) => {
    const formData = new FormData();
    if (file) formData.append('file', file);
    if (phone !== undefined) formData.append('phone', phone);
    const res = await api.put<Setting>('/settings/zalo', formData);
    return res;
  },
  updateAddressInage: async (file?: File | null) => {
    const formData = new FormData();
    if (file) formData.append('file', file);
    const res = await api.put<Setting>('/settings/address-image', formData);
    return res;
  },
  updateAboutPage: async (images?: (string | File)[]) => {
    const formData = new FormData();
    const imgs =
      images?.map((i) => (typeof i === 'string' ? i : null)) || undefined;
    if (imgs) {
      const data = imgs;
      formData.append('data', JSON.stringify(data));
    }
    if (images) {
      images.forEach((file) => {
        if (file instanceof File) {
          formData.append('files', file);
        }
      });
    }
    const res = await api.put<Setting>('/settings/about-page', formData);
    return res;
  }
};

export default settingService;
