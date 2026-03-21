import { api } from '~/utils';
import type { Paginated, QueryParams, Partner, PartnerForm } from '~/types';

const partnerService = {
   get: (params?: Partial<QueryParams>) =>
      api.get<Paginated<Partner>>('/partners/details', params),

   getById: (id: string) => api.get<PartnerForm>(`/partners/${id}`),

   upSert: async (
      id: string | undefined | null,
      data: Partial<PartnerForm>,
      file?: File | null
   ) => {
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      if (file) formData.append('file', file);
      if (id) {
         return api.patch<PartnerForm>(`/partners/${id}`, formData);
      }
      return api.post<PartnerForm>('/partners', formData);
   },

   delete: (id: string) => api.delete(`/partners/${id}`)
};

export default partnerService;
