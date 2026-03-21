import Image from 'next/image';
import { bannerService } from '~/services';
import {
  ActivityTabs,
  FeaturedPost
} from '~/app/[locale]/activities/components';
import RelatedPosts from '~/components/related-posts';

type Props = Readonly<{
  children: React.ReactNode;
}>;

async function Layout({ children }: Props) {
  const [images] = await Promise.all([bannerService.get('activities')]);

  return (
    <section className='bg-background'>
      <div
        className='relative w-full aspect-4/1 bg-cover bg-center z-1'
        style={{
          backgroundImage: images?.[0] ? `url(${images[0]})` : undefined
        }}
      />
      <div className='relative overflow-hidden py-5 lg:py-10'>
        <div className='absolute top-0 right-0 size-100 bg-[#0066B4] rounded-full blur-[20rem] will-change-transform pointer-events-none' />
        <div className='absolute left-0 bottom-0 size-100 bg-[#0066B4] rounded-full blur-[20rem] will-change-transform pointer-events-none' />
        <Image
          src='/logo_deco.png'
          width={584}
          height={480}
          alt='Logo deco'
          loading='lazy'
          className='absolute top-56 right-5 hidden lg:block opacity-25 pointer-events-none select-none translate-x-1/2'
        />
        <div className='relative container space-y-5 lg:space-y-10'>
          <ActivityTabs />
          <FeaturedPost />
          <div className='grid grid-cols-12 gap-5'>
            {children}
            <RelatedPosts />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Layout;
