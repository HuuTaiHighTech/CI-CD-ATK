import { type Metadata } from 'next';
import Image from 'next/image';
import NextLink from 'next/link';
import { PostsCarousel } from '~/app/[locale]/posts/[slug]/components';
import { getDictionary } from '~/lib/dictionary';
import { Link, Tag } from '~/components/ui';
import { bannerService, postService, settingService } from '~/services';
import { notFound } from 'next/navigation';
import { i18n, localeCodes, type Locale } from '~/i18n';
import { cn } from '~/lib/utils';
import { env } from '~/config';

type Props = Readonly<{
  params: Promise<{ locale: string; slug: string }>;
}>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  const post = await postService.getBySlug(slug);

  if (!post) return {};

  const path = `/${locale}/posts/${slug}`;

  const image = {
    url: post.thumbnail,
    width: 1200,
    height: 630,
    alt: post.title
  };

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      url: path,
      siteName: env.APP_NAME,
      images: [image],
      locale: localeCodes[locale as Locale],
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: [image]
    },
    alternates: {
      canonical: path,
      languages: Object.fromEntries(
        i18n.locales.map((l) => [l, `/${l}/posts/${slug}`])
      )
    }
  };
}

async function PostPage({ params }: Props) {
  const { locale, slug } = await params;

  const [dictionary, images, post, ads] = await Promise.all([
    getDictionary(locale),
    bannerService.get('posts'),
    postService.getBySlug(slug),
    settingService.getAdsImage()
  ]);

  if (!post) return notFound();

  const { items } = await postService.get({ limit: 10, group: post.group });
  const posts = items.filter(({ id }) => id !== post.id);

  return (
    <section className='relative lg:bg-background'>
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute top-140 right-0 size-100 bg-[#0066B4] hidden lg:block rounded-full blur-[20rem] will-change-transform pointer-events-none' />
        <div className='absolute top-380 left-0 size-100 bg-[#0066B4] hidden lg:block rounded-full blur-[20rem] will-change-transform pointer-events-none' />
        <div className='absolute top-750 right-0 size-100 bg-[#0066B4] hidden lg:block rounded-full blur-[20rem] will-change-transform pointer-events-none' />
        <div className='absolute top-1100 left-0 size-100 bg-[#0066B4] hidden lg:block rounded-full blur-[20rem] will-change-transform pointer-events-none' />
        <Image
          src='/logo_deco.png'
          width={584}
          height={480}
          alt='Logo deco'
          loading='lazy'
          className='absolute top-310 right-5 hidden lg:block opacity-25 select-none pointer-events-none translate-x-1/2'
        />
        <Image
          src='/logo_deco.png'
          width={584}
          height={480}
          alt='Logo deco'
          loading='lazy'
          className='absolute top-640 left-5 hidden lg:block opacity-25 select-none pointer-events-none -translate-x-1/2'
        />
        <Image
          src='/logo_deco.png'
          width={584}
          height={480}
          alt='Logo deco'
          loading='lazy'
          className='absolute top-830 right-5 hidden lg:block opacity-25 select-none pointer-events-none translate-x-1/2'
        />
      </div>
      <div
        className='relative w-full aspect-4/1 bg-cover bg-center'
        style={{
          backgroundImage: images?.[0] ? `url(${images[0]})` : undefined
        }}
      />
      <div className='relative container space-y-10 py-10'>
        <div className='grid grid-cols-12 gap-5'>
          <div
            className={cn(
              'lg:bg-[#E5EFF7] col-span-12',
              ads ? 'lg:col-span-8' : 'lg:col-span-12',
              'lg:rounded-xl',
              'lg:px-8 lg:py-6',
              'space-y-6'
            )}
          >
            <h1 className='text-3xl lg:text-5xl/tight font-bold text-accent'>
              {post.title}
            </h1>
            <p className='text-sm lg:text-base'>{post.summary}</p>
            <div
              className='prose'
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            <div className='space-y-2 lg:space-y-3'>
              <h2 className='text-2xl lg:text-4xl font-bold uppercase text-accent'>
                {dictionary.company_name}
              </h2>
              <ul>
                <li>
                  <strong>• Fanpage: </strong>
                  <NextLink
                    href='https://www.facebook.com/ANTHAIKHANGJSC'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-400 hover:underline in-hover:underline-offset-4'
                  >
                    An Thái Khang JSC
                  </NextLink>
                </li>
                <li>
                  <strong>• Hotline: </strong>0764 644 245
                </li>
                <li>
                  <strong>• Email: </strong>support@anthaikhang.com
                </li>
                <li>
                  <strong>• Website: </strong>
                  <Link
                    href='/'
                    className='text-blue-400 hover:underline in-hover:underline-offset-4'
                  >
                    https://anthaikhang.com/
                  </Link>
                </li>
              </ul>
            </div>
            {post.tags.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {post.tags.map((item) => (
                  <Tag key={item.id} slug={item.slug}>
                    {item.name}
                  </Tag>
                ))}
              </div>
            )}
          </div>
          {ads && (
            <div className='col-span-4 hidden lg:block'>
              <div className='sticky top-30 xl:top-34 2xl:top-39 z-5'>
                <img
                  src={ads}
                  alt='poster ads'
                  className='w-full rounded-xl object-contain'
                />
              </div>
            </div>
          )}
        </div>
        {posts.length > 0 && (
          <div className='space-y-4'>
            <h2 className='text-accent text-2xl md:text-4xl font-bold'>
              {dictionary.related_posts}
            </h2>
            <PostsCarousel posts={posts} />
          </div>
        )}
      </div>
    </section>
  );
}

export default PostPage;
