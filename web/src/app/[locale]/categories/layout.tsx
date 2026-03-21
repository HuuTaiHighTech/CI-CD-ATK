import Image from 'next/image';
import {
  CategoryBanner,
  CategoryTabs
} from '~/app/[locale]/categories/components';
import { categoryService } from '~/services';

type Props = Readonly<{
  children: React.ReactNode;
}>;

async function Layout({ children }: Props) {
  const categories = await categoryService.get();
  return (
    <section className='relative bg-secondary-2 overflow-hidden'>
      <CategoryBanner />
      <div className='absolute top-400 left-0 size-100 bg-[#0066B4] rounded-full blur-[20rem] will-change-transform pointer-events-none' />
      <div className='absolute top-650 right-0 size-100 bg-[#0066B4] rounded-full blur-[20rem] will-change-transform pointer-events-none' />
      <Image
        src='/logo_deco.png'
        width={584}
        height={480}
        alt='Logo deco'
        loading='lazy'
        className='absolute top-250 right-5 opacity-0 md:opacity-25 pointer-events-none select-none translate-x-1/2'
      />
      <Image
        src='/logo_deco.png'
        width={584}
        height={480}
        alt='Logo deco'
        loading='lazy'
        className='absolute top-625 left-5 opacity-0 md:opacity-25 pointer-events-none select-none -translate-x-1/2'
      />
      <div className='container space-y-10 py-10'>
        <CategoryTabs categories={categories} />
        {children}
      </div>
    </section>
  );
}

export default Layout;
