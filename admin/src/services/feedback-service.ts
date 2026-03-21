import { api } from '~/utils';
import type { Feedback, FeedbackForm, Paginated, QueryParams } from '~/types';

const feedbackService = {
   get: (params?: Partial<QueryParams>) =>
      api.get<Paginated<Feedback>>('/feedbacks/details', params),

   getById: (id: string) => api.get<FeedbackForm>(`/feedbacks/${id}`),

   upSert: async (
      id: string | undefined | null,
      data: Partial<FeedbackForm>,
      file?: File | null
   ) => {
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      if (file) formData.append('file', file);
      if (id) {
         return api.patch<FeedbackForm>(`/feedbacks/${id}`, formData);
      }
      return api.post<FeedbackForm>('/feedbacks', formData);
   },

   delete: (id: string) => api.delete(`/feedbacks/${id}`)
};

export default feedbackService;
