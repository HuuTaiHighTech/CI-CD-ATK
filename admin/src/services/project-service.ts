import { api } from '~/utils';
import type { Paginated, Project, ProjectForm, QueryParams } from '~/types';

const projectService = {
   get: (params?: Partial<QueryParams>) =>
      api.get<Paginated<Project>>('/projects/details', params),

   getById: (id: string) => api.get<ProjectForm>(`/projects/${id}/details`),

   upSert: async (
      id: string | undefined | null,
      data: Partial<ProjectForm>,
      file?: File | null
   ) => {
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      if (file) formData.append('file', file);
      if (id) {
         return api.patch<ProjectForm>(`/projects/${id}`, formData);
      }
      return api.post<ProjectForm>('/projects', formData);
   },

   delete: (id: string) => api.delete(`/projects/${id}`)
};

export default projectService;
