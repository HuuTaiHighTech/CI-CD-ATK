import { type Metadata } from 'next';
import { categoryService } from '~/services';
import { Product } from '~/components/cards';
import { getDictionary } from '~/lib/dictionary';

type Props = Readonly<{
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string }>;
}>;

export async function generateMetadata({
  params,
  searchParams
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const { tab } = await searchParams;

  const [dictionary, categories] = await Promise.all([
    getDictionary(locale),
    categoryService.get()
  ]);

  const title = tab && categories.find((c) => c.slug === tab)?.name;

  return {
    title: title ?? dictionary.nav.categories
  };
}

async function Page({ searchParams }: Props) {
  const { tab } = await searchParams;

  const categoryTree = tab ? await categoryService.getTree(tab) : [];

  return (
    <div className='space-y-10'>
      {categoryTree
        .filter(({ products }) => products && products.length > 0)
        .map((cat) => (
          <div key={cat.id}>
            <h3 className='relative text-white text-xl lg:text-3xl font-semibold before:absolute before:content before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#00ADFE] pl-3 mb-5'>
              {cat.name}
            </h3>
            <div className='grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-6 gap-2'>
              {cat.products.map((product) => (
                <Product
                  key={product.id}
                  image={product.images[0]}
                  name={product.name}
                  slug={product.slug}
                />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}

export default Page;
