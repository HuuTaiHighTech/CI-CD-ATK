import { http } from '~/lib/http';
import { Paginated, Project } from '~/types';

const projectService = {
  get: async (
    page: number = 1,
    limit: number = 7,
    search?: string
  ): Promise<Paginated<Project>> => {
    try {
      const { data } = await http.get<Paginated<Project>>('/projects', {
        params: { page, limit, search }
      });
      return data;
    } catch {
      return {
        items: [],
        pagination: {
          page: 1,
          limit: 7,
          total: 0,
          totalPages: 0
        }
      };
    }
  }
};

export default projectService;
