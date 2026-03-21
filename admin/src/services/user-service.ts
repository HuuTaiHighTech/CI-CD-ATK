import { api } from '~/utils';
import type { Paginated, QueryParams, UserForm, UserDto } from '~/types';

const userService = {
   get: (params?: Partial<QueryParams>) =>
      api.get<Paginated<UserDto>>('/users', params),

   getById: (id: string) => api.get<UserDto>(`/users/${id}`),

   upSert: (id: string | undefined | null, data: Partial<UserForm>) => {
      if (id) {
         if (!data.password) delete data.password;
         return api.patch<UserDto>(`/users/${id}`, data);
      }
      return api.post<UserDto>('/users', data);
   },

   delete: (id: string) => api.delete(`/users/${id}`)
};

export default userService;
