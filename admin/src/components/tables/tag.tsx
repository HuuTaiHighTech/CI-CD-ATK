import { Edit, Eye, Trash2 } from 'lucide-react';
import { DeleteDialog } from '~/components/dialogs';
import { Button } from '~/components/ui/button';
import { Switch } from '~/components/ui/switch';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow
} from '~/components/ui/table';
import type { Tag } from '~/types';
import { formatDateTime, getRowNumber } from '~/utils';

type Props = {
   data: Tag[];
   currentPage: number;
   limit: number;
   isLoading: boolean;
   onEdit?: (id: string) => void;
   onToggle?: (id: string, visible: boolean) => void;
   onDelete?: (id: string) => Promise<void>;
};

function TagTable({
   data,
   currentPage,
   limit,
   isLoading,
   onEdit,
   onToggle,
   onDelete
}: Props) {
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
                  Ngày sửa
               </TableHead>
               <TableHead className='text-neutral-800 text-center'>
                  Ngày tạo
               </TableHead>
               <TableHead className='text-neutral-800 text-center'>
                  Nổi bật
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
                        {item.slug}
                     </span>
                  </TableCell>
                  <TableCell className='text-center'>
                     {formatDateTime(item.updatedAt)}
                  </TableCell>
                  <TableCell className='text-center'>
                     {formatDateTime(item.createdAt)}
                  </TableCell>
                  <TableCell className='text-center'>
                     <Switch
                        checked={item.hot}
                        className='cursor-pointer'
                        onCheckedChange={(checked) =>
                           onToggle?.(item.id, checked)
                        }
                        disabled={isLoading}
                     />
                  </TableCell>
                  <TableCell className='text-center'>
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
                           onClick={() => onEdit?.(item.id)}
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
                  </TableCell>
               </TableRow>
            ))}
         </TableBody>
      </Table>
   );
}

export default TagTable;
