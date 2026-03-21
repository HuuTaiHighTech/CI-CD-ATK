import { Star } from 'lucide-react';
import Image from 'next/image';
import { cn } from '~/lib/utils';

type Props = {
  star: number;
  avatar: string;
  name: string;
  position: string;
  content: string;
  className?: string;
};

function Card({ star, avatar, name, position, content, className }: Props) {
  return (
    <div
      className={cn(
        'w-64 lg:w-md aspect-4/3 lg:aspect-[3/1.7] flex flex-col justify-between bg-white rounded-xl border-2 border-blue-400 shrink-0 overflow-hidden lg:p-6 p-3',
        className
      )}
    >
      <div className='space-y-2'>
        <div className='flex gap-1 lg:gap-1.5'>
          {Array.from({ length: star }).map((_, i) => (
            <Star
              key={i}
              className='size-4 lg:size-6 fill-yellow-300 text-yellow-300'
            />
          ))}
        </div>
        <p className='text-sm lg:text-base font-normal line-clamp-4 overflow-hidden'>
          {content}
        </p>
      </div>
      <div className='flex items-center gap-3'>
        <div className='relative size-10 lg:size-14 rounded-full overflow-hidden shrink-0'>
          <Image
            src={avatar}
            alt={name}
            fill
            sizes='(min-width: 1024px) 56px, 40px'
            className='object-cover'
          />
        </div>
        <div className='flex-1 overflow-hidden'>
          <h5 className='text-base lg:text-lg font-semibold truncate'>
            {name}
          </h5>
          <p className='text-xs lg:text-sm font-normal text-neutral-700 truncate'>
            {position}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Card;
