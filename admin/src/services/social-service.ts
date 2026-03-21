import { api } from '~/utils';
import type { Paginated, QueryParams, Social, SocialForm } from '~/types';

const socialService = {
   get: (params?: Partial<QueryParams>) =>
      api.get<Paginated<Social>>('/socials/details', params),

   getById: (id: string) => api.get<SocialForm>(`/socials/${id}`),

   upSert: async (
      id: string | undefined | null,
      data: Partial<SocialForm>,
      file?: File | null
   ) => {
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      if (file) formData.append('file', file);
      if (id) {
         return api.patch<SocialForm>(`/socials/${id}`, formData);
      }
      return api.post<SocialForm>('/socials', formData);
   },

   delete: (id: string) => api.delete(`/socials/${id}`)
};

export default socialService;
