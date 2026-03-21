import { api } from '~/utils';
import type { Paginated, Post, PostForm, QueryParams } from '~/types';

const postService = {
   get: (params?: Partial<QueryParams>) =>
      api.get<Paginated<Post>>('/posts/details', params),

   getById: (id: string) => api.get<PostForm>(`/posts/${id}/details`),

   upSert: (
      id: string | undefined | null,
      data: Partial<PostForm>,
      file?: File | null
   ) => {
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      if (file) formData.append('file', file);
      if (id) {
         return api.patch<PostForm>(`/posts/${id}`, formData);
      }
      return api.post<PostForm>('/posts', formData);
   },

   delete: (id: string) => api.delete(`/posts/${id}`)
};

export default postService;
