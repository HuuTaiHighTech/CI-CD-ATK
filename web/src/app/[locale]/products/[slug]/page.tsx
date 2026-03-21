import { type Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  ProductDetail,
  ProductsCarousel
} from '~/app/[locale]/products/[slug]/components';
import { productService } from '~/services';
import Tag from '~/components/ui/tag';
import { getDictionary } from '~/lib/dictionary';

type Props = Readonly<{
  params: Promise<{ locale: string; slug: string }>;
}>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const product = await productService.getBySlug(slug);

  return {
    ...(product?.name && {
      title: product.name
    }),
    ...(product?.summary && {
      description: product.summary
    })
  };
}

async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  const [dictionary, product] = await Promise.all([
    getDictionary(locale),
    productService.getBySlug(slug)
  ]);

  if (!product) return notFound();

  const { items } = await productService.get({
    category: product?.category?.slug,
    sub: true
  });
  const products = items.filter(({ id }) => id !== product.id);

  return (
    <div className='relative lg:bg-secondary-2 overflow-hidden'>
      <div className='absolute top-130 right-0 size-100 bg-[#0066B4] hidden lg:block rounded-full blur-[20rem] will-change-transform pointer-events-none' />
      <div className='absolute top-375 left-0 size-100 bg-[#0066B4] hidden lg:block rounded-full blur-[20rem] will-change-transform pointer-events-none' />
      <div className='absolute top-800 right-0 size-100 bg-[#0066B4] hidden lg:block rounded-full blur-[20rem] will-change-transform pointer-events-none' />
      <div className='absolute top-1200 left-0 size-100 bg-[#0066B4] hidden lg:block rounded-full blur-[20rem] will-change-transform pointer-events-none' />
      <div className='absolute top-1525 right-0 size-100 bg-[#0066B4] hidden lg:block rounded-full blur-[20rem] will-change-transform pointer-events-none' />
      <Image
        src='/logo_deco.png'
        width={584}
        height={480}
        alt='Logo deco'
        loading='lazy'
        className='absolute top-250 right-0 hidden lg:block opacity-25 select-none pointer-events-none translate-x-1/2'
      />
      <Image
        src='/logo_deco.png'
        width={584}
        height={480}
        alt='Logo deco'
        loading='lazy'
        className='absolute top-625 left-0 hidden lg:block opacity-25 select-none pointer-events-none -translate-x-1/2'
      />
      <Image
        src='/logo_deco.png'
        width={584}
        height={480}
        alt='Logo deco'
        loading='lazy'
        className='absolute top-1000 right-0 hidden lg:block opacity-25 select-none pointer-events-none translate-x-1/2'
      />
      <Image
        src='/logo_deco.png'
        width={584}
        height={480}
        alt='Logo deco'
        loading='lazy'
        className='absolute top-1375 left-0 hidden lg:block opacity-25 select-none pointer-events-none -translate-x-1/2'
      />
      <div className='relative container bg-white rounded-xl py-5 lg:px-8 lg:py-6 space-y-5 lg:space-y-10 lg:mt-36 lg:mb-20'>
        <ProductDetail
          images={product.images.slice(1)}
          name={product.name}
          feature={dictionary.product_features}
          features={product.features}
          summary={product.summary}
          description={product.description}
        />
        {product.tags.length > 0 && (
          <div className='flex flex-wrap gap-2 mt-6'>
            {product.tags.map((item) => (
              <Tag key={item.id} slug={item.slug}>
                {item.name}
              </Tag>
            ))}
          </div>
        )}
        {product.category && products.length > 0 && (
          <div className='space-y-5 lg:space-y-10'>
            <h2 className='text-3xl font-bold text-accent'>
              {dictionary.related_products}
            </h2>
            <ProductsCarousel products={products} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductPage;
