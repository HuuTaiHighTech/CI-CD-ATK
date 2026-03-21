import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, SearchIcon } from 'lucide-react';
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
import { ROUTES } from '~/constants';
import { projectService } from '~/services';
import type { Project } from '~/types';
import { ProjectTable } from '~/components/tables';
import { AxiosError, limitOptions } from '~/utils';
import { toast } from 'sonner';
import { usePaginated, useQueryParams } from '~/hooks';
import PaginationContainer from '~/components/ui/pagination-container';
import SelectPopover from '~/components/ui/select-popover';

function ProjectPage() {
   const navigate = useNavigate();
   const { set, items, pagination, setItem, isEmpty } = usePaginated<Project>();
   const [isLoading, setIsLoading] = useState<boolean>(false);
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

   const visible = get('visible');

   const fetchProjects = useCallback(async () => {
      try {
         setIsLoading(true);
         const { data } = await projectService.get({
            page,
            limit,
            search: stableSearch,
            visible
         });
         if (data) set(data);
      } catch (error) {
         const { message } = AxiosError(error);
         toast.error(message);
      } finally {
         setIsLoading(false);
      }
   }, [set, page, limit, stableSearch, visible]);

   useEffect(() => {
      fetchProjects();
   }, [fetchProjects]);

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

   const handleVisibleChange = useCallback(
      (value: string | null) => {
         update({ visible: value ?? undefined });
         resetPage();
      },
      [update, resetPage]
   );

   const handleToggleVisible = useCallback(
      async (id: string, visible: boolean) => {
         try {
            setIsLoading(true);
            await projectService.upSert(id, { visible });
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
            await projectService.delete(id);
            const remaining = items.length - 1;
            if (remaining === 0 && page > 1) {
               setPage(page - 1);
            } else {
               await fetchProjects();
            }
            toast.success('Xóa thành công!');
         } catch (error) {
            const { message } = AxiosError(error);
            toast.error(message);
         } finally {
            setIsLoading(false);
         }
      },
      [items.length, page, setPage, fetchProjects]
   );

   return (
      <section>
         <div className='flex flex-col sm:flex-row justify-between items-center gap-3 mb-6'>
            <div>
               <h1 className='text-xl md:text-2xl font-bold text-center sm:text-left mb-2'>
                  Quản lý dự án tiêu biểu
               </h1>
               <p className='text-sm md:text-base text-muted-foreground'>
                  Quản lý danh sách dự án tiêu biểu của bạn
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
                        <ProjectTable
                           data={items}
                           currentPage={page}
                           limit={limit}
                           isLoading={isLoading}
                           onToggleVisible={handleToggleVisible}
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

export default ProjectPage;
