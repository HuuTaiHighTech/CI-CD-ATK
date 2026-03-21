import { Plus, SearchIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FeedbackDialog } from '~/components/dialogs';
import { FeedbackTable } from '~/components/tables';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import {
   InputGroup,
   InputGroupAddon,
   InputGroupInput
} from '~/components/ui/input-group';
import PaginationContainer from '~/components/ui/pagination-container';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue
} from '~/components/ui/select';
import SelectPopover from '~/components/ui/select-popover';
import { usePaginated, useQueryParams } from '~/hooks';
import { feedbackService } from '~/services';
import type { Feedback } from '~/types';
import { AxiosError, limitOptions } from '~/utils';

function FeedbackPage() {
   const { set, items, pagination, setItem, isEmpty } =
      usePaginated<Feedback>();
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [selected, setSelected] = useState<string>();
   const [isOpen, setIsOpen] = useState<boolean>(false);

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

   const star = get('star');
   const visible = get('visible');

   const fetch = useCallback(async () => {
      try {
         setIsLoading(true);
         const { data } = await feedbackService.get({
            page,
            limit,
            search: stableSearch,
            star,
            visible
         });
         if (data) set(data);
      } catch (error) {
         const { message } = AxiosError(error);
         toast.error(message);
      } finally {
         setIsLoading(false);
      }
   }, [set, page, limit, stableSearch, star, visible]);

   useEffect(() => {
      fetch();
   }, [fetch]);

   const handleCreate = useCallback(() => {
      setSelected(undefined);
      setIsOpen(true);
   }, []);

   const handleEdit = useCallback((id: string) => {
      setSelected(id);
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

   const handleStarChange = useCallback(
      (value: string | null) => {
         update({ star: value ?? undefined });
         resetPage();
      },
      [update, resetPage]
   );

   const handleVisibleChange = useCallback(
      (value: string | null) => {
         update({ visible: value ?? undefined });
         resetPage();
      },
      [update, resetPage]
   );

   const handleToggle = useCallback(
      async (id: string, visible: boolean) => {
         try {
            setIsLoading(true);
            await feedbackService.upSert(id, { visible });
            setItem(id, (item) => ({ ...item, visible }));
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
            await feedbackService.delete(id);
            const remaining = items.length - 1;
            if (remaining === 0 && page > 1) {
               setPage(page - 1);
            } else {
               await fetch();
            }
            toast.success('Xóa thành công!');
         } catch (error) {
            const { message } = AxiosError(error);
            toast.error(message);
         } finally {
            setIsLoading(false);
         }
      },
      [fetch, items.length, page, setPage]
   );

   return (
      <>
         <section>
            <div className='flex flex-col sm:flex-row justify-between items-center gap-3 mb-6'>
               <div>
                  <h1 className='text-xl md:text-2xl font-bold text-center sm:text-left mb-2'>
                     Quản lý phản hồi
                  </h1>
                  <p className='text-sm md:text-base text-muted-foreground'>
                     Quản lý danh sách phản hồi của bạn
                  </p>
               </div>
               <Button onClick={handleCreate} className='cursor-pointer'>
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
                           placeholder='Điểm'
                           options={[
                              { id: '1', name: '1' },
                              { id: '2', name: '2' },
                              { id: '3', name: '3' },
                              { id: '4', name: '4' },
                              { id: '5', name: '5' }
                           ]}
                           searchable={false}
                           select={star}
                           onSelect={handleStarChange}
                        />
                     </div>
                     <div className='w-32'>
                        <SelectPopover
                           placeholder='Trạng thái'
                           options={[
                              { id: 'true', name: 'Hiển thị' },
                              { id: 'false', name: 'Ẩn' }
                           ]}
                           searchable={false}
                           select={visible}
                           onSelect={handleVisibleChange}
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
                        <div className='border rounded-lg overflow-hidden'>
                           <FeedbackTable
                              data={items}
                              currentPage={page}
                              limit={limit}
                              isLoading={isLoading}
                              onToggle={handleToggle}
                              onEdit={handleEdit}
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
         {/* dialog */}
         <FeedbackDialog
            id={selected}
            open={isOpen}
            onOpenChange={setIsOpen}
            onSuccess={fetch}
         />
      </>
   );
}
export default FeedbackPage;
