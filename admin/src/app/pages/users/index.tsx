import { useCallback, useEffect, useState } from 'react';
import { Plus, SearchIcon } from 'lucide-react';
import SelectPopover from '~/components/ui/select-popover';
import { toast } from 'sonner';
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
import { ROLES } from '~/constants';
import type { UserDto } from '~/types';
import { usePaginated, useQueryParams } from '~/hooks';
import { userService } from '~/services';
import { AxiosError, limitOptions } from '~/utils';
import { UserTable } from '~/components/tables';
import { UserDialog } from '~/components/dialogs';
import PaginationContainer from '~/components/ui/pagination-container';

function UserPage() {
   const { set, items, pagination, setItem, isEmpty } = usePaginated<UserDto>();
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [isOpen, setIsOpen] = useState<boolean>(false);
   const [selectedUser, setSelectedUser] = useState<UserDto | undefined>();

   const {
      page,
      limit,
      search,
      stableSearch,
      setPage,
      setLimit,
      get,
      update,
      setSearch,
      resetPage
   } = useQueryParams({ page: 1, limit: 10 });

   const role = get('role');
   const active = get('active');

   const fetchUsers = useCallback(async () => {
      try {
         setIsLoading(true);
         const { data } = await userService.get({
            page,
            limit,
            search: stableSearch,
            role,
            active
         });
         if (data) set(data);
      } catch (error) {
         const { message } = AxiosError(error);
         toast.error(message);
      } finally {
         setIsLoading(false);
      }
   }, [set, page, limit, stableSearch, role, active]);

   useEffect(() => {
      fetchUsers();
   }, [fetchUsers]);

   const handleCreate = useCallback(() => {
      setSelectedUser(undefined);
      setIsOpen(true);
   }, []);

   const handleEdit = useCallback((user: UserDto) => {
      setSelectedUser(user);
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

   const handleRoleChange = useCallback(
      (value: string | null) => {
         update({ role: value ?? undefined });
         resetPage();
      },
      [update, resetPage]
   );

   const handleActiveChange = useCallback(
      (value: string | null) => {
         update({ active: value ?? undefined });
         resetPage();
      },
      [update, resetPage]
   );

   const handleToggle = useCallback(
      async (id: string, active: boolean) => {
         try {
            setIsLoading(true);
            await userService.upSert(id, { active });
            setItem(id, (item) => ({ ...item, active }));
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
            await userService.delete(id);
            const remaining = items.length - 1;
            if (remaining === 0 && page > 1) {
               setPage(page - 1);
            } else {
               await fetchUsers();
            }
            toast.success('Xóa thành công!');
         } catch (error) {
            const { message } = AxiosError(error);
            toast.error(message);
         } finally {
            setIsLoading(false);
         }
      },
      [fetchUsers, items.length, page, setPage]
   );

   return (
      <>
         <section>
            <div className='flex flex-col sm:flex-row justify-between items-center gap-3 mb-6'>
               <div>
                  <h1 className='text-xl md:text-2xl font-bold text-center sm:text-left mb-2'>
                     Quản lý người dùng
                  </h1>
                  <p className='text-sm md:text-base text-muted-foreground'>
                     Quản lý danh sách người dùng của bạn
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
                     <div className='w-40'>
                        <SelectPopover
                           placeholder='Vai trò'
                           options={ROLES.map((role) => ({
                              id: role.value,
                              name: role.label
                           }))}
                           searchable={false}
                           select={role}
                           onSelect={handleRoleChange}
                        />
                     </div>
                     <div className='w-32'>
                        <SelectPopover
                           placeholder='Trạng thái'
                           options={[
                              { id: 'true', name: 'Kích hoạt' },
                              { id: 'false', name: 'Vô hiệu hóa' }
                           ]}
                           searchable={false}
                           select={active}
                           onSelect={handleActiveChange}
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
                           <UserTable
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
         <UserDialog
            open={isOpen}
            onOpenChange={setIsOpen}
            user={selectedUser}
            onSuccess={fetchUsers}
         />
      </>
   );
}

export default UserPage;
