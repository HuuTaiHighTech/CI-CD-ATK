import { http } from '~/lib/http';
import type { Feedback } from '~/types';

const feedbackService = {
  get: async (): Promise<Feedback[]> => {
    try {
      const { data } = await http.get<Feedback[]>('/feedbacks');
      return data;
    } catch {
      return [];
    }
  }
};

export default feedbackService;
