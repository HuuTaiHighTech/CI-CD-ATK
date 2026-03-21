import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Link } from '~/components/ui';
import { cn } from '~/lib/utils';

type Props = {
  icon: React.ElementType;
  title: string;
  description: string;
  link: {
    text: string;
    href: string;
  };
  variant?: 'primary' | 'default';
};

function Card({
  icon: Icon,
  title,
  link,
  description,
  variant = 'default'
}: Props) {
  return (
    <>
      {/* desktop */}
      <div className='relative group hidden flex-1 aspect-205/226 sm:flex flex-col justify-between rounded-2xl lg:rounded-4xl bg-[linear-gradient(275.65deg,#0066B4_0%,#1C2A45_100%)] hover:shadow-[0_0_32px_8px_rgba(0,102,180,0.35)] transition-all duration-300 ease-in-out shrink-0 overflow-hidden lg:p-8 md:p-5 p-3 gap-2 lg:gap-5'>
        <div className='flex'>
          <Icon
            className={cn(
              'w-1/4 aspect-square transition-colors shrink-0',
              variant === 'primary' ? 'text-primary' : 'text-white'
            )}
          />
          <div className='absolute top-0 right-0 w-2/5 aspect-square select-none translate-x-5 -translate-y-5'>
            <Image
              src='/deco_hero_section.png'
              alt='deco'
              width={438}
              height={438}
              className='size-full object-cover'
            />
          </div>
        </div>
        <div className='space-y-1 sm:space-y-3'>
          <div className='relative'>
            <h3 className='text-sm md:text-base lg:text-2xl xl:text-4xl font-semibold text-white transition-colors mb-1.5'>
              {title}
            </h3>
            <div className='w-[12%] h-0 bg-[#00ADFE] group-hover:h-0.5 transition-[height]' />
          </div>
          <div className='max-h-0 invisible opacity-0 transition-all duration-300 ease-in-out group-hover:max-h-80 group-hover:visible group-hover:opacity-100 line-clamp-3 md:line-clamp-4 xl:line-clamp-6 2xl:line-clamp-5 overflow-hidden'>
            <p className='text-xs lg:text-sm xl:text-base 2xl:text-lg text-white font-medium'>
              {description}
            </p>
          </div>

          <Link
            href={link.href}
            className='group/item bg-primary hidden sm:inline-flex justify-center items-center text-xs lg:text-sm xl:text-base text-white font-medium lg:font-semibold rounded-full select-none cursor-pointer overflow-hidden p-2 lg:p-3 2xl:p-4 gap-1 lg:gap-2'
          >
            <span
              data-text={link.text}
              className='flex-1 h-fit relative group-hover/item:-translate-y-[200%] after:absolute after:content-[attr(data-text)] after:size-full after:top-[200%] after:left-0 duration-300 transition-transform'
            >
              {link.text}
            </span>
            <span className='size-3 md:size-4 lg:size-5 inline-flex justify-center items-center rounded-full bg-white text-primary shrink-0'>
              <ArrowRight className='shrink-0 size-1.5 md:size-2 lg:size-3' />
            </span>
          </Link>
        </div>
      </div>
      {/* mobile */}
      <Link
        href={link.href}
        className='relative sm:hidden flex-1 aspect-205/226 flex flex-col justify-between rounded-2xl lg:rounded-4xl bg-[linear-gradient(275.65deg,#0066B4_0%,#1C2A45_100%)] shrink-0 overflow-hidden lg:p-8 md:p-5 p-3 gap-2 lg:gap-5'
      >
        <div className='flex'>
          <Icon
            className={cn(
              'w-1/4 aspect-square transition-colors shrink-0',
              variant === 'primary' ? 'text-primary' : 'text-white'
            )}
          />
          <div className='absolute top-0 right-0 w-2/5 aspect-square select-none translate-x-5 -translate-y-5'>
            <Image
              src='/deco_hero_section.png'
              alt='deco'
              width={438}
              height={438}
              className='size-full object-cover'
            />
          </div>
        </div>
        <div className='space-y-1 sm:space-y-3'>
          <div className='relative'>
            <h3 className='text-xs font-semibold text-white mb-1.5'>{title}</h3>
          </div>
        </div>
      </Link>
    </>
  );
}

export default Card;
