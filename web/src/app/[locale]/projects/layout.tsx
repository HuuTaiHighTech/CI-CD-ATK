import Image from 'next/image';
import { bannerService } from '~/services';

type Props = Readonly<{
  children: React.ReactNode;
}>;

async function Layout({ children }: Props) {
  const images = await bannerService.get('projects');

  return (
    <section className='relative bg-[#0D131F] overflow-hidden'>
      <div
        className='relative w-full aspect-4/1 bg-cover bg-center'
        style={{
          backgroundImage: images?.[0] ? `url(${images[0]})` : undefined
        }}
      />
      <div className='absolute top-250 right-0 size-100 bg-[#0066B4] rounded-full blur-[20rem] will-change-transform pointer-events-none' />
      <div className='absolute top-550 left-0 size-100 bg-[#0066B4] rounded-full blur-[20rem] will-change-transform pointer-events-none' />
      <div className='absolute top-775 right-0 size-100 bg-[#0066B4] rounded-full blur-[20rem] will-change-transform pointer-events-none' />
      <div className='absolute top-1050 left-0 size-100 bg-[#0066B4] rounded-full blur-[20rem] will-change-transform pointer-events-none' />
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
        className='absolute top-675 left-5 opacity-0 md:opacity-25 pointer-events-none select-none -translate-x-1/2'
      />
      <Image
        src='/logo_deco.png'
        width={584}
        height={480}
        alt='Logo deco'
        loading='lazy'
        className='absolute top-1037.5 right-5 opacity-0 md:opacity-25 pointer-events-none select-none translate-x-1/2'
      />
      {children}
    </section>
  );
}

export default Layout;
