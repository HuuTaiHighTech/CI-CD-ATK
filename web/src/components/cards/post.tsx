import Image from 'next/image';
import { CalendarDays } from 'lucide-react';
import { Link } from '~/components/ui';
import { cn } from '~/lib/utils';

type VariantValue = 'dark' | 'light';

type ResponsiveVariant =
  | VariantValue
  | {
      md: VariantValue;
      lg?: VariantValue;
    };

type Props = {
  thumbnail: string;
  title: string;
  time: string;
  slug: string;
  variant?: ResponsiveVariant;
};

const titleVariantMap: Record<VariantValue, string> = {
  dark: 'text-white',
  light: 'text-neutral-900'
};

const timeVariantMap: Record<VariantValue, string> = {
  dark: 'text-neutral-300',
  light: 'text-neutral-500'
};

function resolveVariantClass(
  variant: ResponsiveVariant,
  map: Record<VariantValue, string>
) {
  if (typeof variant === 'string') {
    return map[variant];
  }

  return cn(map[variant.md], variant.lg && `lg:${map[variant.lg]}`);
}

function Post({ thumbnail, time, title, slug, variant = 'dark' }: Props) {
  return (
    <Link
      href={`/posts/${slug}`}
      className='group w-full block transition-transform duration-300 hover:-translate-y-2'
    >
      <div className='relative w-full aspect-3/2 rounded-lg overflow-hidden'>
        <Image
          src={thumbnail}
          alt={title}
          fill
          sizes='(max-width:640px) 50vw, (max-width:768px) 33vw, (max-width:1024px) 33vw, (max-width:1280px) 25vw, 20vw'
          className='object-cover'
        />
      </div>
      <div className='flex items-center gap-1 mt-1.5'>
        <CalendarDays size={17} className='text-[#2D80BD]' />
        <span
          className={cn(
            'text-sm',
            resolveVariantClass(variant, timeVariantMap)
          )}
        >
          {time}
        </span>
      </div>
      <h3
        className={cn(
          'text-base md:text-lg font-medium line-clamp-2',
          resolveVariantClass(variant, titleVariantMap),
          'group-hover:text-accent transition-colors cursor-pointer'
        )}
      >
        {title}
      </h3>
    </Link>
  );
}

export default Post;
