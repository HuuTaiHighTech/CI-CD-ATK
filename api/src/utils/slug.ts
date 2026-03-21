import slug from 'slugify';

const LETTERS = 'abcdefghijklmnopqrstuvwxyz';

const randomLetters = (length: number) => {
   if (length <= 0) return '';
   const arr = new Uint8Array(length);
   crypto.getRandomValues(arr);
   return Array.from(arr, (b) => LETTERS[b % 26]).join('');
};

const slugify = (text: string, random?: number | [number, number]) => {
   let result = slug(text, {
      lower: true,
      locale: 'vi',
      strict: true
   });

   if (random) {
      let length: number;

      if (Array.isArray(random)) {
         const [min, max] = random;
         length = Math.floor(Math.random() * (max - min + 1)) + min;
      } else {
         length = random;
      }

      if (length > 0) {
         result += `-${randomLetters(length)}`;
      }
   }

   return result;
};
export default slugify;
