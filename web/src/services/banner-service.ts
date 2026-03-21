import { http } from '~/lib/http';

interface Banner {
  id: string;
  key: string;
  name: string;
  images: string[];
}

const bannerService = {
  get: async (key: string): Promise<string[]> => {
    try {
      const { data } = await http.get<Banner>(`/banners/${key}`);
      return data.images;
    } catch {
      return [];
    }
  }
};
export default bannerService;
