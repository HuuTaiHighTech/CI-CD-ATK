import { Edit, Eye, Trash2 } from 'lucide-react';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow
} from '~/components/ui/table';
import { Switch } from '~/components/ui/switch';
import { Button } from '~/components/ui/button';
import type { UserDto } from '~/types';
import { formatDateTime, getRowNumber } from '~/utils';
import { DeleteDialog } from '~/components/dialogs';
import useAuth from '~/hooks/use-auth';
import { ROLE_MAP } from '~/constants';

interface Props {
   data: UserDto[];
   currentPage: number;
   limit: number;
   isLoading: boolean;
   onToggle?: (id: string, visible: boolean) => void;
   onEdit?: (user: UserDto) => void;
   onDelete?: (id: string) => Promise<void>;
}

function UserTable({
   data,
   currentPage,
   limit,
   isLoading,
   onToggle,
   onEdit,
   onDelete
}: Props) {
   const { user } = useAuth();

   return (
      <Table>
         <TableHeader>
            <TableRow>
               <TableHead className='text-neutral-800 text-center'>
                  STT
               </TableHead>
               <TableHead className='text-neutral-800 text-center'>
                  Thông tin
               </TableHead>
               <TableHead className='text-neutral-800 text-center'>
                  Vai trò
               </TableHead>
               <TableHead className='text-neutral-800 text-center'>
                  Ngày sửa
               </TableHead>
               <TableHead className='text-neutral-800 text-center'>
                  Ngày tạo
               </TableHead>
               <TableHead className='text-neutral-800 text-center'>
                  Kích hoạt
               </TableHead>
               <TableHead className='text-neutral-800 text-center'>
                  Thao tác
               </TableHead>
            </TableRow>
         </TableHeader>
         <TableBody>
            {data.map((item, index) => (
               <TableRow key={item.id}>
                  <TableCell className='text-center'>
                     {getRowNumber(index, currentPage, limit)}
                  </TableCell>
                  <TableCell className='text-center'>
                     <h5 className='font-medium'>{item.name}</h5>
                     <span className='text-sm text-muted-foreground'>
                        {item.username}
                     </span>
                  </TableCell>
                  <TableCell className='text-center'>
                     {ROLE_MAP[item.role]}
                  </TableCell>
                  <TableCell className='text-center'>
                     {formatDateTime(item.updatedAt)}
                  </TableCell>
                  <TableCell className='text-center'>
                     {formatDateTime(item.createdAt)}
                  </TableCell>
                  <TableCell className='text-center'>
                     {user?.id !== item.id && (
                        <Switch
                           checked={item.active}
                           className='cursor-pointer'
                           onCheckedChange={(checked) =>
                              onToggle?.(item.id, checked)
                           }
                           disabled={isLoading}
                        />
                     )}
                  </TableCell>
                  <TableCell className='text-center'>
                     {user?.id !== item.id && (
                        <div className='flex justify-center gap-1'>
                           <Button
                              variant='ghost'
                              size='icon'
                              type='button'
                              className='cursor-pointer'
                              disabled={isLoading}
                           >
                              <Eye className='size-4' />
                           </Button>
                           <Button
                              variant='ghost'
                              size='icon'
                              type='button'
                              className='cursor-pointer'
                              onClick={() => onEdit?.(item)}
                              disabled={isLoading}
                           >
                              <Edit className='size-4 text-blue-500' />
                           </Button>
                           <DeleteDialog
                              id={item.id}
                              name={item.name}
                              isLoading={isLoading}
                              onDelete={onDelete}
                           >
                              <Button
                                 variant='ghost'
                                 size='icon'
                                 type='button'
                                 className='cursor-pointer'
                                 disabled={isLoading}
                              >
                                 <Trash2 className='size-4 text-destructive' />
                              </Button>
                           </DeleteDialog>
                        </div>
                     )}
                  </TableCell>
               </TableRow>
            ))}
         </TableBody>
      </Table>
   );
}
export default UserTable;
