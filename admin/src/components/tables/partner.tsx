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
import type { Partner } from '~/types';
import { formatDateTime, getRowNumber } from '~/utils';
import { DeleteDialog } from '~/components/dialogs';

interface Props {
  data: Partner[];
  currentPage: number;
  limit: number;
  isLoading: boolean;
  onToggle?: (id: string, visible: boolean) => void;
  onEdit?: (data: Partner) => void;
  onDelete?: (id: string) => Promise<void>;
}

function PartnerTable({
  data,
  currentPage,
  limit,
  isLoading,
  onToggle,
  onEdit,
  onDelete
}: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='text-neutral-800 text-center'>STT</TableHead>
          <TableHead className='text-neutral-800 text-center'>
            Biểu tượng
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
            Hiển thị
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
            <TableCell>
              <div className='flex items-center justify-center'>
                {item.logo ? (
                  <img
                    src={item.logo}
                    className='w-20 rounded object-cover'
                    alt={item.name}
                  />
                ) : (
                  '-'
                )}
              </div>
            </TableCell>
            <TableCell className='text-center'>
              <h5 className='font-medium'>{item.name}</h5>
              <Button variant='link' className='text-sm text-blue-500' asChild>
                <a href={item.url} target='_blank' rel='noopener noreferrer'>
                  {item.url}
                </a>
              </Button>
            </TableCell>
            <TableCell className='text-center'>
              {formatDateTime(item.updatedAt)}
            </TableCell>
            <TableCell className='text-center'>
              {formatDateTime(item.createdAt)}
            </TableCell>
            <TableCell className='text-center'>
              <Switch
                checked={item.visible}
                className='cursor-pointer'
                onCheckedChange={(checked) => onToggle?.(item.id, checked)}
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
export default PartnerTable;
