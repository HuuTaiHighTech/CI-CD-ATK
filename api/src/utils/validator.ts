import { type Language } from '@prisma/client';
import { BadRequestException } from '~/exceptions';

function getDuplicates<T>(arr: T[]): T[] {
   const seen = new Set<T>();
   const duplicates = new Set<T>();

   for (const item of arr) {
      if (seen.has(item)) {
         duplicates.add(item);
      } else {
         seen.add(item);
      }
   }

   return [...duplicates];
}

const validate = {
   i18n: <T extends { lang: Language }>(
      i18n?: T[],
      defaultLang: Language = 'VI'
   ): T => {
      if (!i18n?.length || i18n.length < 2) {
         throw new BadRequestException('Phải có ít nhất 2 bản dịch');
      }

      const langs = i18n.map((t) => t.lang);
      const dups = getDuplicates(langs);

      if (dups.length) {
         throw new BadRequestException(`Ngôn ngữ bị trùng: ${dups.join(', ')}`);
      }

      const lang = i18n.find((t) => t.lang === defaultLang);
      if (!lang) {
         throw new BadRequestException(`${defaultLang} là ngôn ngữ mặc định`);
      }

      return lang;
   }
};

export default validate;
