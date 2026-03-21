import { api } from '~/utils';
import type { Credentials, ProfileForm, UpdatePassword, User } from '~/types';

const authService = {
   me: () => api.get<User | null>('/me'),

   update: (data: ProfileForm | UpdatePassword) => api.patch<User>('/me', data),

   signIn: (credentials: Credentials) =>
      api.post<User>('/sign-in', credentials),

   signOut: () => api.post('/sign-out')
};

export default authService;
