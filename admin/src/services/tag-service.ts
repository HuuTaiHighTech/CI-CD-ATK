import type { Paginated, QueryParams, Tag, TagForm } from '~/types';
import { api } from '~/utils';

const tagService = {
   get: () => api.get<Tag[]>('/tags'),

   paginate: (params?: Partial<QueryParams>) =>
      api.get<Paginated<Tag>>('/tags/details', params),

   getById: (id: string) => api.get<TagForm>(`/tags/${id}/details`),

   upSert: (id: string | undefined | null, data: TagForm) => {
      if (id) {
         return api.patch<TagForm>(`/tags/${id}`, data);
      }
      return api.post<TagForm>('/tags', data);
   },

   delete: (id: string) => api.delete(`/tags/${id}`)
};

export default tagService;
