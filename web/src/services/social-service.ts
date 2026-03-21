import { http } from '~/lib/http';
import type { Social } from '~/types';

const socialService = {
  get: async (): Promise<Social[]> => {
    try {
      const { data } = await http.get<Social[]>('/socials');
      return data;
    } catch {
      return [];
    }
  }
};
export default socialService;
