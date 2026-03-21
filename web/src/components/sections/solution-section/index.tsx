'use client';

import InteractiveHouse from '~/components/sections/solution-section/interactive-house';
import type { ProductPin } from '~/types';
import type { Dictionary } from '~/lib/dictionary';

type Props = {
  dictionary: Dictionary;
  products: ProductPin[];
};

function SolutionSection({ dictionary, products }: Props) {
  return (
    <section className='relative overflow-hidden'>
      <div className='relative w-full sm:hidden'>
        <img
          src='/giai-phap-keo-dan-cho-ngoi-nha.svg'
          alt={dictionary.solution.title}
          className='w-full'
        />
      </div>
      <div className='absolute inset-0 hidden sm:flex'>
        <div className='h-full w-1/2 rotate-180 scale-x-[-1] bg-[conic-gradient(from_90deg_at_78.65%_49.95%,#FFFFFF_0deg,#0066B4_108deg,#1C2A45_360deg)]' />
        <div className='h-full w-1/2 rotate-180 bg-[conic-gradient(from_90deg_at_78.65%_49.95%,#FFFFFF_0deg,#0066B4_108deg,#1C2A45_360deg)]' />
      </div>
      <div className='absolute hidden sm:block inset-0 bg-linear-to-b from-background via-[#001c27]/40 to-background' />
      <div className='container py-0 md:py-16'>
        <div className='absolute sm:relative top-8 md:top-0 space-y-4 px-4'>
          <h3 className='text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white text-center lg:mb-6 md:mb-3 mb-1'>
            {dictionary.solution.title}
          </h3>
          <div className='flex flex-col justify-center text-white text-sm md:text-base lg:text-lg font-medium text-center'>
            <span>{dictionary.solution.subtitle}</span>
          </div>
        </div>
        <InteractiveHouse products={products} />
      </div>
    </section>
  );
}
export default SolutionSection;
