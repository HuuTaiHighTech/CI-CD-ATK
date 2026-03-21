import { Post } from '~/components/cards';
import { Pagination } from '~/components/ui';
import { formatDate } from '~/lib/date';
import { postService } from '~/services';

type Props = Readonly<{
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
}>;

async function Page({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  const { page } = await searchParams;

  const currentPage = Number(page) > 0 ? Number(page) : 1;

  const { items, pagination } = await postService.get({
    page: currentPage,
    tags: [slug]
  });

  return (
    <div className='container py-10'>
      <div className='grid lg:grid-cols-3 grid-cols-2 gap-5 mb-5'>
        {items.map((item) => (
          <Post
            key={item.id}
            slug={item.slug}
            thumbnail={item.thumbnail}
            title={item.title}
            time={formatDate(item.createdAt, locale)}
            variant='light'
          />
        ))}
      </div>
      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        varian='light'
        scrollToTop
      />
    </div>
  );
}

export default Page;
