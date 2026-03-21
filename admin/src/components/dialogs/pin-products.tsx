import { useCallback, useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle
} from '~/components/ui/dialog';
import { Spinner } from '~/components/ui/spinner';
import { pinProductsService, productService } from '~/services';
import type { PinProductForm, ProductSelect } from '~/types';
import { AxiosError } from '~/utils';
import { PinProductSchema } from '~/validators';
import { ImageUploader } from '~/components/ui/image-uploader';
import TreeSelect from '~/components/ui/tree-select';

type Props = {
   id?: string;
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onSuccess?: () => void;
};

function PinProductsDialog({ id, open, onOpenChange, onSuccess }: Props) {
   const isEdit = !!id;
   const [products, setProducts] = useState<ProductSelect[]>([]);
   const [file, setFile] = useState<File | null>();
   const init = useMemo(
      (): PinProductForm => ({
         productId: undefined,
         image: undefined
      }),
      []
   );
   const {
      control,
      setValue,
      getValues,
      handleSubmit,
      reset,
      formState: { isSubmitting, isDirty }
   } = useForm<PinProductForm>({
      resolver: zodResolver(PinProductSchema),
      defaultValues: init
   });

   useEffect(() => {
      if (!open) {
         setFile(undefined);
         reset(init);
         return;
      }
      const run = async () => {
         const summaryPromise = productService.getSummary();
         const topPromise = id ? pinProductsService.getById(id) : null;
         const [sRes, tRes] = await Promise.all([summaryPromise, topPromise]);
         setProducts(sRes.data ?? []);
         if (tRes) reset(tRes.data ?? init);
      };

      run();
   }, [open, id, init, reset]);

   const handleImageUpload = useCallback(
      (file: File | null) => {
         setFile(file);
         setValue('changed', true, { shouldDirty: true });
      },
      [setValue]
   );

   const onSubmit = async (form: PinProductForm) => {
      try {
         if (!form.productId) {
            toast.error('Hãy chọn sản phẩm');
            return;
         }
         const { data } = await pinProductsService.upSert(id, form, file);
         toast.success(isEdit ? 'Cập nhật thành công!' : 'Thêm thành công!');
         onSuccess?.();
         if (file) setFile(undefined);
         reset(
            data ?? {
               ...init,
               image: getValues('image') === undefined ? null : undefined
            }
         );
      } catch (error) {
         const { message } = AxiosError(error);
         toast.error(message);
      }
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent
            onEscapeKeyDown={(e) => {
               if (isSubmitting) e.preventDefault();
            }}
            onPointerDownOutside={(e) => {
               if (isSubmitting) e.preventDefault();
            }}
            className='sm:max-w-[425px] max-h-[90vh] overflow-y-auto'
         >
            <DialogHeader>
               <DialogTitle>{isEdit ? 'Cập nhật' : 'Thêm mới'}</DialogTitle>
               <DialogDescription>
                  Make changes to your profile here. Click save when you&apos;re
                  done.
               </DialogDescription>
            </DialogHeader>
            <form className='grid gap-3' onSubmit={handleSubmit(onSubmit)}>
               <ImageUploader
                  value={getValues('image')}
                  onChange={handleImageUpload}
                  disabled={isSubmitting}
               />
               <Controller
                  name='productId'
                  control={control}
                  render={({ field }) => (
                     <TreeSelect
                        options={products?.map((p) => ({
                           ...p,
                           parentId: undefined
                        }))}
                        select={field.value}
                        onSelect={field.onChange}
                        placeholder='Sản phẩm'
                        disabled={isSubmitting}
                     />
                  )}
               />
               <DialogFooter className='mt-3'>
                  <DialogClose asChild>
                     <Button
                        type='button'
                        variant='outline'
                        className='cursor-pointer'
                        disabled={isSubmitting}
                     >
                        Hủy
                     </Button>
                  </DialogClose>
                  <Button
                     type='submit'
                     className='cursor-pointer'
                     disabled={isSubmitting || !isDirty}
                  >
                     {isSubmitting ? <Spinner /> : 'Lưu'}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}

export default PinProductsDialog;
