import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { Link } from '~/components/ui';

type Props = {
  image: string;
  name: string;
  slug: string;
};

function Product({ image, name, slug }: Props) {
  return (
    <Link
      href={`/products/${slug}`}
      className='relative w-full aspect-2/3 max-w-2xs flex flex-col justify-end rounded-xl shadow-md hover:ring-2 hover:ring-[#00ADFE] overflow-hidden mx-auto'
    >
      <div className='absolute inset-0'>
        {image && (
          <Image
            src={image}
            alt={name}
            fill
            sizes='(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw'
            className='object-cover'
          />
        )}
      </div>
      <div className='relative w-full aspect-3/1 border-t border-neutral-300 bg-[#011590] flex flex-col justify-between gap-2 px-3 py-2 md:px-4 md:py-3'>
        <h3 className='text-xs md:text-base lg:text-lg font-semibold text-white line-clamp-2'>
          {name}
        </h3>
        <p className='inline-flex items-center text-xs text-white gap-0.5 lg:gap-1'>
          Xem thêm
          <ChevronRight className='size-3 shrink-0' />
        </p>
      </div>
    </Link>
  );
}

export default Product;
