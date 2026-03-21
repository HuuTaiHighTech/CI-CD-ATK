import { useNavigate } from 'react-router-dom';
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
import { formatDateTime, getRowNumber } from '~/utils';
import { DeleteDialog } from '~/components/dialogs';
import type { Post } from '~/types';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { GROUP_MAP } from '~/constants';

type Props = {
  data: Post[];
  currentPage: number;
  limit: number;
  isLoading: boolean;
  onToggleHot?: (id: string, hot: boolean) => void;
  onTogglePublished?: (id: string, published: boolean) => void;
  onDelete?: (id: string) => Promise<void>;
};

function PostTable({
  data,
  currentPage,
  limit,
  onToggleHot,
  onTogglePublished,
  onDelete,
  isLoading
}: Props) {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='text-neutral-800 text-center'>STT</TableHead>
          <TableHead className='text-neutral-800 text-center'>
            Hình ảnh
          </TableHead>
          <TableHead className='text-neutral-800 text-center'>
            Thông tin
          </TableHead>
          <TableHead className='text-neutral-800 text-center'>Nhóm</TableHead>
          <TableHead className='text-neutral-800 text-center'>
            Danh mục
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
            Xuất bản
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
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    className='w-32 aspect-3/2 rounded object-cover'
                  />
                ) : (
                  '-'
                )}
              </div>
            </TableCell>
            <TableCell className='text-center'>
              <h5 className='font-medium'>{item.title}</h5>
              <span className='text-sm text-muted-foreground'>{item.slug}</span>
            </TableCell>
            <TableCell className='text-center'>
              {GROUP_MAP[item.group]}
            </TableCell>
            <TableCell className='text-center'>
              {item.category?.name || '—'}
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
                onCheckedChange={(checked) => onToggleHot?.(item.id, checked)}
                disabled={isLoading}
              />
            </TableCell>
            <TableCell className='text-center'>
              <Switch
                disabled={isLoading}
                checked={item.published}
                className='cursor-pointer'
                onCheckedChange={(checked) =>
                  onTogglePublished?.(item.id, checked)
                }
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
                  onClick={() => navigate(item.id)}
                  disabled={isLoading}
                >
                  <Edit className='size-4 text-blue-500' />
                </Button>
                <DeleteDialog
                  id={item.id}
                  name={item.title}
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

export default PostTable;
