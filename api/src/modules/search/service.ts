import type { Group, Language, Prisma } from '@prisma/client';
import { prisma } from '~/config';
import type { Cursor } from '~/types';
import { type Query } from '~/modules/search/schema';

type Item = {
   type: 'product' | 'post';
   id: string;
   image: string | null;
   name: string;
   slug: string;
   createdAt: Date;
};

const INSIGHT_GROUPS: Group[] = [
   'ALWAYS_TAKE_CARE',
   'TRUST_IN_MIND',
   'KEEP_PROMISE'
];

const ACTIVITY_GROUPS: Group[] = ['COMPANY', 'COMMUNITY'];

class SearchService {
   private product;
   private post;

   constructor() {
      this.product = prisma.product;
      this.post = prisma.post;
   }

   private parseCursor(cursor?: string): {
      product?: string;
      post?: string;
   } {
      if (!cursor) return {};

      try {
         const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
         const parts = decoded.split('|');
         const cursors: { product?: string; post?: string } = {};

         parts.forEach((part) => {
            const [type, id] = part.split(':');
            if ((type === 'product' || type === 'post') && id) {
               cursors[type] = id;
            }
         });

         return cursors;
      } catch {
         return {};
      }
   }

   private encodeCursor(
      productCursor?: string | null,
      postCursor?: string | null
   ): string | null {
      const parts: string[] = [];

      if (productCursor) parts.push(`product:${productCursor}`);
      if (postCursor) parts.push(`post:${postCursor}`);

      if (parts.length === 0) return null;

      return Buffer.from(parts.join('|')).toString('base64');
   }

   private async getPosts(
      search: string,
      cursor: string | null,
      limit: number,
      lang: Language = 'VI',
      groups?: Group[]
   ): Promise<Cursor<Item>> {
      const where: Prisma.PostWhereInput = {
         published: true,
         ...(groups && { group: { in: groups } }),
         i18n: {
            some: {
               OR: [
                  {
                     title: {
                        contains: search,
                        mode: 'insensitive'
                     }
                  },
                  {
                     summary: {
                        contains: search,
                        mode: 'insensitive'
                     }
                  }
               ]
            }
         }
      };
      const posts = await this.post.findMany({
         where,
         select: {
            id: true,
            slug: true,
            thumbnail: true,
            createdAt: true,
            i18n: {
               where: { lang },
               select: { title: true }
            }
         },
         orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
         take: limit + 1,
         ...(cursor && {
            cursor: { id: cursor },
            skip: 1
         })
      });

      const hasMore = posts.length > limit;
      const items: Item[] = posts.slice(0, limit).map((p) => ({
         type: 'post',
         id: p.id,
         name: p.i18n[0].title,
         slug: p.slug,
         image: p.thumbnail,
         createdAt: p.createdAt
      }));

      const nextCursor =
         hasMore && items.length > 0 ? items[items.length - 1].id : null;

      return {
         items,
         pagination: {
            nextCursor,
            hasMore
         }
      };
   }

   private async getProducts(
      search: string,
      cursor: string | null,
      limit: number,
      lang: Language = 'VI'
   ): Promise<Cursor<Item>> {
      const where: Prisma.ProductWhereInput = {
         visible: true,
         i18n: {
            some: {
               OR: [
                  {
                     name: {
                        contains: search,
                        mode: 'insensitive'
                     }
                  },
                  {
                     summary: {
                        contains: search,
                        mode: 'insensitive'
                     }
                  }
               ]
            }
         }
      };
      const products = await this.product.findMany({
         where,
         select: {
            id: true,
            slug: true,
            images: true,
            createdAt: true,
            i18n: {
               where: { lang },
               select: { name: true }
            }
         },
         orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
         take: limit + 1,
         ...(cursor && {
            cursor: { id: cursor },
            skip: 1
         })
      });

      const hasMore = products.length > limit;
      const items: Item[] = products.slice(0, limit).map((p) => {
         const images = p.images;

         const firstImage =
            Array.isArray(images) && images.length > 0 && images[0];

         return {
            type: 'product',
            id: p.id,
            name: p.i18n[0].name,
            slug: p.slug,
            image: firstImage as string,
            createdAt: p.createdAt
         };
      });

      const nextCursor =
         hasMore && items.length > 0 ? items[items.length - 1].id : null;

      return {
         items,
         pagination: {
            nextCursor,
            hasMore
         }
      };
   }

   async get(query: Query, lang: Language = 'VI'): Promise<Cursor<Item>> {
      const { cursor, limit = 10, q, type } = query;
      const crs = this.parseCursor(cursor);

      if (!q) {
         return {
            items: [],
            pagination: {
               nextCursor: null,
               hasMore: false
            }
         };
      }

      if (type === 'product') {
         return this.getProducts(q, crs.product ?? null, limit, lang);
      } else if (type === 'insight') {
         return this.getPosts(q, crs.post ?? null, limit, lang, INSIGHT_GROUPS);
      } else if (type === 'activity') {
         return this.getPosts(
            q,
            crs.post ?? null,
            limit,
            lang,
            ACTIVITY_GROUPS
         );
      }

      const lpt = Math.ceil(limit / 2);

      let [products, posts] = await Promise.all([
         this.getProducts(q, crs.product ?? null, lpt, lang),
         this.getPosts(q, crs.post ?? null, lpt, lang)
      ]);
      let total = products.items.length + posts.items.length;

      if (total < limit) {
         const shortage = limit - total;

         if (products.items.length < lpt && posts.pagination.hasMore) {
            const extra = await this.getPosts(
               q,
               posts.pagination.nextCursor,
               shortage,
               lang
            );
            posts = {
               items: [...posts.items, ...extra.items],
               pagination: extra.pagination
            };
         } else if (posts.items.length < lpt && posts.pagination.hasMore) {
            const extra = await this.getProducts(
               q,
               products.pagination.nextCursor,
               shortage,
               lang
            );
            products = {
               items: [...products.items, ...extra.items],
               pagination: extra.pagination
            };
         }
      }

      const allItems = [...products.items, ...posts.items].sort((a, b) => {
         const timeDiff = b.createdAt.getTime() - a.createdAt.getTime();
         return timeDiff !== 0 ? timeDiff : b.id.localeCompare(a.id);
      });

      const items = allItems.slice(0, limit);
      const nextCursor = this.encodeCursor(
         products.pagination.nextCursor,
         posts.pagination.nextCursor
      );

      return {
         items,
         pagination: {
            nextCursor:
               products.pagination.hasMore || posts.pagination.hasMore
                  ? nextCursor
                  : null,
            hasMore: products.pagination.hasMore || posts.pagination.hasMore
         }
      };
   }
}

export default new SearchService();
