import { api } from '~/utils';
import type { Benefit, BenefitForm, Paginated, QueryParams } from '~/types';

const benefitService = {
   get: (params?: Partial<QueryParams>) =>
      api.get<Paginated<Benefit>>('/benefits/details', params),

   getById: (id: string) => api.get<BenefitForm>(`/benefits/${id}/details`),

   upSert: async (id: string | undefined | null, data: BenefitForm) => {
      if (id) {
         return api.patch<BenefitForm>(`/benefits/${id}`, data);
      }
      return api.post<BenefitForm>('/benefits', data);
   },

   delete: (id: string) => api.delete(`/benefits/${id}`)
};

export default benefitService;
