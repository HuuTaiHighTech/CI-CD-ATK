import { type Metadata } from 'next';
import { Post } from '~/components/cards';
import { Pagination } from '~/components/ui';
import { formatDate } from '~/lib/date';
import { getDictionary } from '~/lib/dictionary';
import { postService } from '~/services';

type Props = Readonly<{
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string; page?: string; category?: string }>;
}>;

export async function generateMetadata({
  params,
  searchParams
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const { tab } = await searchParams;
  const dictionary = await getDictionary(locale);

  const title = dictionary.activities.find(({ id }) => id === tab)?.name;

  return {
    title
  };
}

async function Page({ params, searchParams }: Props) {
  const { locale } = await params;
  const { tab, page, category } = await searchParams;

  const currentPage = Number(page) > 0 ? Number(page) : 1;

  const { items, pagination } = await postService.get({
    page: currentPage,
    group: tab,
    category: category,
    sub: true
  });

  return (
    <div className='relative col-span-12 lg:col-span-8'>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-3 mb-5'>
        {items.map((item) => (
          <Post
            key={item.id}
            thumbnail={item.thumbnail}
            slug={item.slug}
            time={formatDate(item.createdAt, locale)}
            title={item.title}
          />
        ))}
      </div>
      <Pagination page={pagination.page} totalPages={pagination.totalPages} />
    </div>
  );
}

export default Page;
