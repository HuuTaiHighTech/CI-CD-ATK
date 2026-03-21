import { cache } from 'react';
import { http } from '~/lib/http';
import type { Paginated, Post, PostSummary } from '~/types';

type Query = {
  page?: number;
  limit?: number;
  hot?: boolean;
  category?: string;
  tags?: string[];
  group?: string;
  relate?: string[];
  sub?: boolean;
};

const normalizeGroup = (value?: string) => {
  if (!value) return undefined;
  return value.replaceAll('-', '_');
};

const normalizeGroups = (values?: string[]) =>
  values?.map((v) => v.replaceAll('-', '_'));

const postService = {
  get: cache(
    async ({
      page = 1,
      limit = 6,
      hot,
      category,
      tags,
      group,
      relate,
      sub
    }: Query): Promise<Paginated<PostSummary>> => {
      try {
        const { data } = await http.get<Paginated<PostSummary>>('/posts', {
          params: {
            page,
            limit,
            hot,
            category,
            tags,
            group: normalizeGroup(group),
            relate: normalizeGroups(relate),
            sub
          }
        });
        return data;
      } catch {
        return {
          items: [],
          pagination: {
            page: 1,
            limit: 6,
            total: 0,
            totalPages: 0
          }
        };
      }
    }
  ),
  getBySlug: cache(async (slug: string): Promise<Post | null> => {
    try {
      const { data } = await http.get<Post>(`/posts/${slug}`);
      return data;
    } catch {
      return null;
    }
  })
};

export default postService;
