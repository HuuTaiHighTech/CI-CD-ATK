import Image from 'next/image';
import { bannerService, categoryService, tagService } from '~/services';
import {
  FeaturedPost,
  FilterPost,
  InsightTabs
} from '~/app/[locale]/insights/components';
import { getDictionary } from '~/lib/dictionary';
import RelatedPosts from '~/components/related-posts';
import { Tag } from '~/components/ui';

type Props = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

async function Layout({ children, params }: Props) {
  const { locale } = await params;

  const [dictionary, images, tags, categories] = await Promise.all([
    getDictionary(locale),
    bannerService.get('insights'),
    tagService.getHot(),
    categoryService.get()
  ]);

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
          <InsightTabs />
          <div className='grid grid-cols-12 gap-5'>
            <FeaturedPost />
            <div className='col-span-4 hidden h-full lg:flex flex-col'>
              <div className='rounded-t-2xl bg-secondary-2 py-4'>
                <h3 className='text-2xl font-semibold text-white text-center'>
                  {dictionary.hot_keywords}
                </h3>
              </div>
              <div className='flex-1 border-2 border-blue-400 rounded-b-2xl px-4 py-5'>
                <div className='flex flex-wrap gap-4'>
                  {tags.map((tag) => (
                    <Tag key={tag.id} slug={tag.slug}>
                      {tag.name}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <FilterPost categories={categories} />
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
