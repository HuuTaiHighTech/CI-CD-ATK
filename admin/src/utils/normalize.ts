import slugify from 'slugify';

const normalize = (str: string) =>
   slugify(str, {
      lower: true,
      locale: 'vi',
      trim: true,
      strict: true
   });

export default normalize;
