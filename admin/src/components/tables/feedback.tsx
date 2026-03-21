import { Edit, Eye, Star, Trash2 } from 'lucide-react';
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
import type { Feedback } from '~/types';
import { formatDateTime, getRowNumber } from '~/utils';
import { DeleteDialog } from '~/components/dialogs';

interface Props {
  data: Feedback[];
  currentPage: number;
  limit: number;
  isLoading: boolean;
  onToggle?: (id: string, visible: boolean) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => Promise<void>;
}

function FeedbackTable({
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
            Điểm đánh giá
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
            <TableCell className='text-center'>
              <div className='flex justify-center items-center space-x-1'>
                {Array.from({ length: item.star }).map((_, i) => (
                  <Star
                    key={i}
                    className='size-5 fill-yellow-500 text-yellow-500'
                  />
                ))}
              </div>
            </TableCell>
            <TableCell className='text-center'>
              <div className='flex justify-center items-center gap-2'>
                <div className='size-12 rounded-full flex items-center justify-center overflow-hidden'>
                  {item.avatar && (
                    <img
                      src={item.avatar}
                      className='size-full object-cover'
                      alt={item.name}
                    />
                  )}
                </div>
                <div className='text-left'>
                  <h5 className='font-medium'>{item.name}</h5>
                  <span className='text-sm text-muted-foreground'>
                    {item.position}
                  </span>
                </div>
              </div>
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
export default FeedbackTable;
