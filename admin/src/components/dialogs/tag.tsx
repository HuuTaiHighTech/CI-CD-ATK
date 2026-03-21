import { useEffect, useMemo } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { LANGUAGES } from '~/constants';
import { tagService } from '~/services';
import type { TagForm } from '~/types';
import { AxiosError } from '~/utils';
import { TagSchema } from '~/validators';
import { Switch } from '~/components/ui/switch';

type Props = {
   id?: string;
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onSuccess?: () => void;
};

function TagDialog({ id, open, onOpenChange, onSuccess }: Props) {
   const isEdit = !!id;
   const {
      register,
      control,
      handleSubmit,
      reset,
      formState: { isSubmitting, isDirty }
   } = useForm<TagForm>({
      resolver: zodResolver(TagSchema)
   });

   const init = useMemo(
      (): TagForm => ({
         i18n: [
            { lang: 'VI', name: '' },
            { lang: 'EN', name: '' }
         ],
         hot: false
      }),
      []
   );

   useEffect(() => {
      if (!open) return;
      if (id) {
         tagService.getById(id).then(({ data }) => {
            reset(data ?? init);
         });
      } else {
         reset(init);
      }
   }, [open, id, init, reset]);

   const onSubmit = async (data: TagForm) => {
      try {
         await tagService.upSert(id, data);
         toast.success(isEdit ? 'Cập nhật thành công!' : 'Thêm thành công!');
         onSuccess?.();
         if (!isEdit) reset();
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
            className='sm:max-w-[425px]'
         >
            <DialogHeader>
               <DialogTitle>
                  {isEdit ? 'Cập nhật thẻ' : 'Thêm thẻ mới'}
               </DialogTitle>
               <DialogDescription>
                  Make changes to your profile here. Click save when you&apos;re
                  done.
               </DialogDescription>
            </DialogHeader>
            <form className='grid gap-3' onSubmit={handleSubmit(onSubmit)}>
               <Tabs defaultValue={LANGUAGES[0].value}>
                  <TabsList className='grid w-full grid-cols-2'>
                     {LANGUAGES.map((lang) => (
                        <TabsTrigger
                           key={lang.value}
                           value={lang.value}
                           disabled={isSubmitting}
                        >
                           {lang.label}
                        </TabsTrigger>
                     ))}
                  </TabsList>
                  {LANGUAGES.map((lang, index) => {
                     return (
                        <TabsContent
                           key={lang.value}
                           value={lang.value}
                           className='space-y-4'
                        >
                           <div className='space-y-2'>
                              <Label htmlFor={`name-${lang.value}`}>
                                 Tên thẻ ({lang.label})
                              </Label>
                              <Input
                                 id={`name-${lang.value}`}
                                 {...register(`i18n.${index}.name`)}
                                 autoFocus
                                 disabled={isSubmitting}
                              />
                           </div>
                        </TabsContent>
                     );
                  })}
               </Tabs>
               <div className='flex items-center gap-2'>
                  <Label htmlFor='active'>Nổi bật:</Label>
                  <Controller
                     name='hot'
                     control={control}
                     render={({ field }) => (
                        <Switch
                           id='hot'
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

export default TagDialog;
