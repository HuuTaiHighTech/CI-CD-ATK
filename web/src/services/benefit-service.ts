import { http } from '~/lib/http';

interface Benefit {
  id: string;
  title: string;
  items: string[];
}

const benefitService = {
  get: async (): Promise<Benefit[]> => {
    try {
      const { data } = await http.get<Benefit[]>('/benefits');
      return data;
    } catch {
      return [];
    }
  }
};
export default benefitService;
