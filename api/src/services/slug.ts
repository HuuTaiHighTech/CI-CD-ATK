import { prisma } from '~/config';
import { slugify } from '~/utils';

type Model = 'category' | 'product' | 'tag' | 'post';

const MAP: Record<Model, any> = {
   category: prisma.category,
   tag: prisma.tag,
   product: prisma.product,
   post: prisma.post
};

class SlugService {
   protected makeSlug = async (
      model: Model,
      name: string,
      id?: string
   ): Promise<string> => {
      let slug = slugify(name);
      let counter = 1;
      while (true) {
         const exists = await MAP[model].findFirst({
            where: { slug, ...(id && { id: { not: id } }) },
            select: { id: true }
         });
         if (!exists) return slug;
         slug = slugify(name) + '-' + counter;
         counter++;
      }
   };
}

export default SlugService;
