import { useCallback, useEffect, useState } from 'react';
import { Plus, SearchIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PinProductsTable } from '~/components/tables';
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
import { pinProductsService } from '~/services';
import { PinProductsDialog } from '~/components/dialogs';
import type { PinProduct } from '~/types';
import { AxiosError, limitOptions } from '~/utils';

function PinProducts() {
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [selected, setSelected] = useState<string>();
   const [isOpen, setIsOpen] = useState<boolean>(false);
   const { set, items, pagination, isEmpty } = usePaginated<PinProduct>();
   const {
      page,
      limit,
      search,
      stableSearch,
      setPage,
      setLimit,
      setSearch,
      resetPage
   } = useQueryParams({ page: 1, limit: 10 });

   const fetchData = useCallback(async () => {
      try {
         setIsLoading(true);
         const { data } = await pinProductsService.get({
            page,
            limit,
            search: stableSearch
         });
         if (data) set(data);
      } catch (error) {
         const { message } = AxiosError(error);
         toast.error(message);
      } finally {
         setIsLoading(false);
      }
   }, [set, page, limit, stableSearch]);

   useEffect(() => {
      fetchData();
   }, [fetchData]);

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

   const handleDelete = useCallback(
      async (id: string) => {
         try {
            setIsLoading(true);
            await pinProductsService.delete(id);
            const remaining = items.length - 1;
            if (remaining === 0 && page > 1) {
               setPage(page - 1);
            } else {
               await fetchData();
            }
            toast.success('Xóa thành công!');
         } catch (error) {
            const { message } = AxiosError(error);
            toast.error(message);
         } finally {
            setIsLoading(false);
         }
      },
      [items.length, page, setPage, fetchData]
   );

   return (
      <>
         <section>
            <div className='flex flex-col sm:flex-row justify-between items-center gap-3 mb-6'>
               <div>
                  <h1 className='text-xl md:text-2xl font-bold text-center sm:text-left mb-2'>
                     Quản lý sản phẩm nổi bật
                  </h1>
                  <p className='text-sm md:text-base text-muted-foreground'>
                     Quản lý danh sách sản phẩm nổi bật của bạn
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
                           <PinProductsTable
                              data={items}
                              currentPage={page}
                              limit={limit}
                              isLoading={isLoading}
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
         <PinProductsDialog
            id={selected}
            open={isOpen}
            onOpenChange={setIsOpen}
            onSuccess={fetchData}
         />
      </>
   );
}

export default PinProducts;
