import { Plus, SearchIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PostTable } from '~/components/tables';
import PaginationContainer from '~/components/ui/pagination-container';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '~/components/ui/input-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { GROUPS, ROUTES } from '~/constants';
import { usePaginated, useQueryParams } from '~/hooks';
import { categoryService, postService } from '~/services';
import type { CategorySelect, Post } from '~/types';
import { AxiosError, limitOptions } from '~/utils';
import SelectPopover from '~/components/ui/select-popover';

function PostPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategorySelect[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { set, items, pagination, setItem, isEmpty } = usePaginated<Post>();
  const {
    page,
    limit,
    search,
    stableSearch,
    setPage,
    setLimit,
    setSearch,
    update,
    get,
    resetPage,
  } = useQueryParams({ page: 1, limit: 10 });

  const category = get('category');
  const group = get('group');
  const hot = get('hot');
  const published = get('published');

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await postService.get({
        page,
        limit,
        search: stableSearch,
        category,
        group,
        hot,
        published,
      });
      if (data) set(data);
    } catch (error) {
      const { message } = AxiosError(error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [set, page, limit, stableSearch, category, group, hot, published]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await categoryService.getSummary();
      if (data) setCategories(data.map((c) => ({ ...c, id: c.slug })));
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreate = useCallback(() => {
    navigate(ROUTES.CREATE);
  }, [navigate]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  const handleLimitChange = useCallback(
    (value: string) => {
      setLimit(Number(value));
      resetPage();
    },
    [setLimit, resetPage]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      resetPage();
    },
    [setSearch, resetPage]
  );

  const handleCategoryChange = useCallback(
    (value: string | null) => {
      update({ category: value ?? undefined });
      resetPage();
    },
    [update, resetPage]
  );

  const handleGroupChange = useCallback(
    (value: string | null) => {
      update({ group: value ?? undefined });
      resetPage();
    },
    [update, resetPage]
  );

  const handleHotChange = useCallback(
    (value: string | null) => {
      update({ hot: value ?? undefined });
      resetPage();
    },
    [update, resetPage]
  );

  const handlePublishedChange = useCallback(
    (value: string | null) => {
      update({ published: value ?? undefined });
      resetPage();
    },
    [update, resetPage]
  );

  const handleToggleHot = useCallback(
    async (id: string, hot: boolean) => {
      try {
        setIsLoading(true);
        await postService.upSert(id, { hot });
        setItem(id, (item) => ({ ...item, hot }));
      } catch (error) {
        const { message } = AxiosError(error);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [setItem]
  );

  const handleTogglePublished = useCallback(
    async (id: string, published: boolean) => {
      try {
        setIsLoading(true);
        await postService.upSert(id, { published });
        setItem(id, (item) => ({ ...item, published }));
      } catch (error) {
        const { message } = AxiosError(error);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [setItem]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        await postService.delete(id);
        const remaining = items.length - 1;
        if (remaining === 0 && page > 1) {
          setPage(page - 1);
        } else {
          await fetchPosts();
        }
        toast.success('Xóa thành công!');
      } catch (error) {
        const { message } = AxiosError(error);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchPosts, items.length, page, setPage]
  );

  return (
    <section>
      <div className='flex flex-col sm:flex-row justify-between items-center gap-3 mb-6'>
        <div>
          <h1 className='text-xl md:text-2xl font-bold text-center sm:text-left mb-2'>
            Quản lý bài viết
          </h1>
          <p className='text-sm md:text-base text-muted-foreground'>
            Quản lý danh sách bài viết của bạn
          </p>
        </div>
        <Button onClick={handleCreate} type='button' className='cursor-pointer'>
          <Plus className='size-4' />
          Thêm
        </Button>
      </div>
      <Card>
        <CardContent className='space-y-5'>
          <div className='flex flex-col xl:flex-row gap-2'>
            <Select
              defaultValue='10'
              value={String(limit)}
              onValueChange={handleLimitChange}
            >
              <SelectTrigger className='w-20'>
                <SelectValue placeholder='Số dòng' />
              </SelectTrigger>
              <SelectContent>
                {limitOptions.map((num) => (
                  <SelectItem key={num} value={String(num)}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className='flex-1'>
              <InputGroup>
                <InputGroupInput
                  placeholder='Tìm kiếm...'
                  value={search}
                  onChange={handleSearchChange}
                />
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div className='w-50'>
              <SelectPopover
                placeholder='Danh mục'
                options={categories}
                select={category}
                onSelect={handleCategoryChange}
              />
            </div>
            <div className='w-44'>
              <SelectPopover
                placeholder='Nhóm'
                options={GROUPS.map((gr) => ({
                  id: gr.value,
                  name: gr.label,
                }))}
                searchable={false}
                select={group}
                onSelect={handleGroupChange}
              />
            </div>
            <div className='w-32'>
              <SelectPopover
                placeholder='Trạng thái'
                options={[{ id: 'true', name: 'Nổi bật' }]}
                searchable={false}
                select={hot}
                onSelect={handleHotChange}
              />
            </div>
            <div className='w-32'>
              <SelectPopover
                placeholder='Trạng thái'
                options={[
                  { id: 'true', name: 'Hiển thị' },
                  { id: 'false', name: 'Ẩn' },
                ]}
                searchable={false}
                select={published}
                onSelect={handlePublishedChange}
              />
            </div>
          </div>

          {isEmpty ? (
            <div className='text-center py-8'>
              <p className='text-muted-foreground'>
                Không tìm thấy bản ghi nào
              </p>
            </div>
          ) : (
            <>
              <div className='border rounded-lg'>
                <PostTable
                  data={items}
                  currentPage={page}
                  limit={limit}
                  isLoading={isLoading}
                  onToggleHot={handleToggleHot}
                  onTogglePublished={handleTogglePublished}
                  onDelete={handleDelete}
                />
              </div>
              <PaginationContainer
                page={pagination.page}
                totalPages={pagination.totalPages}
                onChange={handlePageChange}
              />
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
export default PostPage;
