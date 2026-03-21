import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { bannerService, tagService } from '~/services';

type Props = Readonly<{
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const tag = await tagService.getBySlug(slug);

  return {
    ...(tag?.name && { title: tag?.name })
  };
}

async function Layout({ children, params }: Props) {
  const { slug } = await params;

  const [images, tag] = await Promise.all([
    bannerService.get('tags'),
    tagService.getBySlug(slug)
  ]);

  if (!tag) return notFound();

  return (
    <section>
      <div
        className='relative w-full aspect-4/1 bg-cover bg-center'
        style={{
          backgroundImage: images?.[0] ? `url(${images[0]})` : undefined
        }}
      >
        <h3 className='absolute top-1/2 left-1/2 text-2xl lg:text-4xl font-bold text-white -translate-1/2'>
          #{tag.name}
        </h3>
      </div>
      {children}
    </section>
  );
}

export default Layout;
