import { useState } from 'react';
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger
} from '~/components/ui/alert-dialog';
import { Spinner } from '~/components/ui/spinner';

type Props = {
   id: string;
   name: string;
   isLoading?: boolean;
   onDelete?: (id: string) => Promise<void>;
   children?: React.ReactNode;
};

function DeleteDialog({ id, name, isLoading, onDelete, children }: Props) {
   const [open, setOpen] = useState<boolean>(false);

   const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      await onDelete?.(id);
      setOpen(false);
   };

   const handleOpenChange = (newOpen: boolean) => {
      if (isLoading) return;
      setOpen(newOpen);
   };
   return (
      <AlertDialog open={open} onOpenChange={handleOpenChange}>
         <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
         <AlertDialogContent
            onEscapeKeyDown={(e) => {
               if (isLoading) e.preventDefault();
            }}
         >
            <AlertDialogHeader>
               <AlertDialogTitle>Xóa "{name}"?</AlertDialogTitle>
               <AlertDialogDescription>
                  Hành động này không thể hoàn tác. Dữ liệu liên quan sẽ bị xóa
                  vĩnh viễn khỏi hệ thống.
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel
                  className='cursor-pointer'
                  disabled={isLoading}
               >
                  Hủy
               </AlertDialogCancel>
               <AlertDialogAction
                  className='bg-rose-500 hover:bg-rose-600 text-white cursor-pointer'
                  disabled={isLoading}
                  onClick={handleDelete}
               >
                  {isLoading ? <Spinner /> : 'Xác nhận'}
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}

export default DeleteDialog;
