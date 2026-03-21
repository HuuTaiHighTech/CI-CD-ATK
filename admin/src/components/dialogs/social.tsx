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
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Spinner } from '~/components/ui/spinner';
import { socialService } from '~/services';
import type { Social, SocialForm } from '~/types';
import { AxiosError } from '~/utils';
import { SocialSchema } from '~/validators';
import { Switch } from '~/components/ui/switch';
import { ImageUploader } from '~/components/ui/image-uploader';

type Props = {
   social?: Social;
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onSuccess?: () => void;
};

function SocialDialog({ social, open, onOpenChange, onSuccess }: Props) {
   const isEdit = !!social;
   const [file, setFile] = useState<File | null>();
   const {
      register,
      control,
      setValue,
      getValues,
      handleSubmit,
      reset,
      formState: { isSubmitting, errors, isDirty }
   } = useForm<SocialForm>({
      resolver: zodResolver(SocialSchema)
   });

   const init = useMemo(
      (): SocialForm => ({
         name: '',
         url: '',
         icon: undefined,
         visible: false
      }),
      []
   );

   useEffect(() => {
      if (social) {
         reset(social);
      } else {
         reset(init);
      }
   }, [social, init, reset]);

   const handleImageUpload = useCallback(
      (file: File | null) => {
         setFile(file);
         setValue('changed', true, { shouldDirty: true });
      },
      [setValue]
   );

   const onSubmit = async (form: SocialForm) => {
      try {
         const { data } = await socialService.upSert(social?.id, form, file);
         toast.success(isEdit ? 'Cập nhật thành công!' : 'Thêm thành công!');
         onSuccess?.();
         if (file) setFile(undefined);
         reset(
            data ?? {
               ...init,
               icon: getValues('icon') === undefined ? null : undefined
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
                  value={getValues('icon')}
                  onChange={handleImageUpload}
                  disabled={isSubmitting}
               />
               <div className='space-y-2'>
                  <Label htmlFor='name'>Tên</Label>
                  <Input
                     id='name'
                     {...register('name')}
                     disabled={isSubmitting}
                  />
                  {errors.name && (
                     <p className='text-red-500 text-sm'>
                        {errors.name.message}
                     </p>
                  )}
               </div>
               <div className='space-y-2'>
                  <Label htmlFor='url'>Đường dẫn</Label>
                  <Input
                     id='url'
                     {...register('url')}
                     disabled={isSubmitting}
                  />
                  {errors.url && (
                     <p className='text-red-500 text-sm'>
                        {errors.url.message}
                     </p>
                  )}
               </div>
               <div className='flex items-center gap-2'>
                  <Label htmlFor='visible'>Hiển thị:</Label>
                  <Controller
                     name='visible'
                     control={control}
                     render={({ field }) => (
                        <Switch
                           id='visible'
                           checked={field.value}
                           onCheckedChange={field.onChange}
                           className='cursor-pointer'
                           disabled={isSubmitting}
                        />
                     )}
                  />
               </div>
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

export default SocialDialog;
