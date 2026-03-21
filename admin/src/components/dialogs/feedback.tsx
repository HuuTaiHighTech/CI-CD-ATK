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
import { feedbackService } from '~/services';
import type { FeedbackForm } from '~/types';
import { AxiosError, cn } from '~/utils';
import { FeedbackSchema } from '~/validators';
import { Switch } from '~/components/ui/switch';
import AvatarUpload from '~/components/ui/avatar-upload';
import { Textarea } from '~/components/ui/textarea';
import { LANGUAGES } from '~/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Star } from 'lucide-react';

type Props = {
   id?: string;
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onSuccess?: () => void;
};

function FeedbackDialog({ id, open, onOpenChange, onSuccess }: Props) {
   const isEdit = !!id;
   const [file, setFile] = useState<File | null>();
   const {
      register,
      control,
      setValue,
      getValues,
      watch,
      handleSubmit,
      reset,
      formState: { isSubmitting, isDirty }
   } = useForm<FeedbackForm>({
      resolver: zodResolver(FeedbackSchema)
   });

   const init = useMemo(
      (): FeedbackForm => ({
         avatar: undefined,
         star: 0,
         i18n: [
            { lang: 'VI', name: '', position: '', content: '' },
            { lang: 'EN', name: '', position: '', content: '' }
         ],
         visible: false
      }),
      []
   );

   useEffect(() => {
      if (!open) return;
      if (id) {
         feedbackService.getById(id).then(({ data }) => {
            reset(data ?? init);
         });
      } else {
         reset(init);
      }
   }, [open, id, init, reset]);

   const handleImageUpload = useCallback(
      (file: File | null) => {
         setFile(file);
         setValue('changed', true, { shouldDirty: true });
      },
      [setValue]
   );

   const onSubmit = async (form: FeedbackForm) => {
      try {
         const { data } = await feedbackService.upSert(id, form, file);
         toast.success(isEdit ? 'Cập nhật thành công!' : 'Thêm thành công!');
         onSuccess?.();
         if (file) setFile(undefined);
         reset(
            data ?? {
               ...init,
               avatar: getValues('avatar') === undefined ? null : undefined
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
               <AvatarUpload
                  value={getValues('avatar')}
                  onChange={handleImageUpload}
                  disabled={isSubmitting}
               />
               <div className='flex space-x-1 mx-auto'>
                  {[1, 2, 3, 4, 5].map((i) => (
                     <button
                        key={i}
                        type='button'
                        onClick={() =>
                           setValue('star', i, { shouldDirty: true })
                        }
                        className='text-yellow-500 cursor-pointer'
                        disabled={isSubmitting}
                     >
                        <Star
                           className={cn(
                              watch('star') >= i
                                 ? 'fill-yellow-500'
                                 : 'fill-transparent'
                           )}
                        />
                     </button>
                  ))}
               </div>
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
                                 Tên ({lang.label})
                              </Label>
                              <Input
                                 id={`name-${lang.value}`}
                                 {...register(`i18n.${index}.name`)}
                                 autoFocus
                                 disabled={isSubmitting}
                              />
                           </div>
                           <div className='space-y-2'>
                              <Label htmlFor={`position-${lang.value}`}>
                                 Vị trí ({lang.label})
                              </Label>
                              <Input
                                 id={`position-${lang.value}`}
                                 {...register(`i18n.${index}.position`)}
                                 disabled={isSubmitting}
                              />
                           </div>
                           <div className='space-y-2'>
                              <Label htmlFor={`content-${lang.value}`}>
                                 Nội dung ({lang.label})
                              </Label>
                              <Textarea
                                 id={`content-${lang.value}`}
                                 {...register(`i18n.${index}.content`)}
                                 className='h-20 resize-none'
                                 disabled={isSubmitting}
                              />
                           </div>
                        </TabsContent>
                     );
                  })}
               </Tabs>
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

export default FeedbackDialog;
