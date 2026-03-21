import { useCallback, useEffect, useState } from 'react';
import { Plus, SearchIcon } from 'lucide-react';
import { toast } from 'sonner';
import { TagTable } from '~/components/tables';
import PaginationContainer from '~/components/ui/pagination-container';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import {
   InputGroup,
   InputGroupAddon,
   InputGroupInput
} from '~/components/ui/input-group';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue
} from '~/components/ui/select';
import { usePaginated, useQueryParams } from '~/hooks';
import { tagService } from '~/services';
import { TagDialog } from '~/components/dialogs';
import { AxiosError, limitOptions } from '~/utils';
import type { Tag } from '~/types';
import SelectPopover from '~/components/ui/select-popover';

function TagPage() {
   const { set, setItem, items, pagination, isEmpty } = usePaginated<Tag>();
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [isOpen, setIsOpen] = useState<boolean>(false);
   const [selectedTag, setSelectedTag] = useState<string | undefined>();

   const {
      page,
      limit,
      search,
      stableSearch,
      get,
      update,
      setPage,
      setLimit,
      setSearch,
      resetPage
   } = useQueryParams({ page: 1, limit: 10 });

   const hot = get('hot');

   const fetchTags = useCallback(async () => {
      try {
         setIsLoading(true);
         const { data } = await tagService.paginate({
            page,
            limit,
            search: stableSearch,
            hot
         });
         if (data) set(data);
      } catch (error) {
         const { message } = AxiosError(error);
         toast.error(message);
      } finally {
         setIsLoading(false);
      }
   }, [set, page, limit, stableSearch, hot]);

   useEffect(() => {
      fetchTags();
   }, [fetchTags]);

   const handleCreate = useCallback(() => {
      setSelectedTag(undefined);
      setIsOpen(true);
   }, []);

   const handleEdit = useCallback((id: string) => {
      setSelectedTag(id);
      setIsOpen(true);
   }, []);

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

   const handleHotChange = useCallback(
      (value: string | null) => {
         update({ hot: value ?? undefined });
         resetPage();
      },
      [update, resetPage]
   );

   const handleToggle = useCallback(
      async (id: string, hot: boolean) => {
         try {
            setIsLoading(true);
            await tagService.upSert(id, { hot });
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

   const handleDelete = useCallback(
      async (id: string) => {
         try {
            setIsLoading(true);
            await tagService.delete(id);
            const remaining = items.length - 1;
            if (remaining === 0 && page > 1) {
               setPage(page - 1);
            } else {
               await fetchTags();
            }
            toast.success('Xóa thành công!');
         } catch (error) {
            const { message } = AxiosError(error);
            toast.error(message);
         } finally {
            setIsLoading(false);
         }
      },
      [fetchTags, items.length, page, setPage]
   );

   return (
      <>
         <section>
            <div className='flex flex-col sm:flex-row justify-between items-center gap-3 mb-6'>
               <div>
                  <h1 className='text-xl md:text-2xl font-bold text-center sm:text-left mb-2'>
                     Quản lý thẻ
                  </h1>
                  <p className='text-sm md:text-base text-muted-foreground'>
                     Quản lý danh sách thẻ của bạn
                  </p>
               </div>
               <Button
                  onClick={handleCreate}
                  type='button'
                  className='cursor-pointer'
               >
                  <Plus className='size-4' />
                  Thêm
               </Button>
            </div>
            <Card>
               <CardContent className='space-y-5'>
                  <div className='flex flex-col sm:flex-row gap-2'>
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
                     <div className='w-32'>
                        <SelectPopover
                           placeholder='Trạng thái'
                           options={[{ id: 'true', name: 'Nổi bật' }]}
                           searchable={false}
                           select={hot}
                           onSelect={handleHotChange}
                        />
                     </div>
                  </div>

                  {isEmpty ? (
                     <div className='text-center py-8'>
                        <p className='text-muted-foreground'>
                           Không tìm thấy thẻ nào
                        </p>
                     </div>
                  ) : (
                     <>
                        <div className='border rounded-lg overflow-hidden'>
                           <TagTable
                              data={items}
                              currentPage={page}
                              limit={limit}
                              isLoading={isLoading}
                              onEdit={handleEdit}
                              onToggle={handleToggle}
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
         <TagDialog
            id={selectedTag}
            open={isOpen}
            onOpenChange={setIsOpen}
            onSuccess={fetchTags}
         />
      </>
   );
}

export default TagPage;
