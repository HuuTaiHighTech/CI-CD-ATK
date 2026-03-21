import { http } from '~/lib/http';
import type { Partner } from '~/types';

const partnerService = {
  get: async (): Promise<Partner[]> => {
    try {
      const { data } = await http.get<Partner[]>('/partners');
      return data;
    } catch {
      return [];
    }
  }
};

export default partnerService;
