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
import { benefitService } from '~/services';
import type { BenefitForm } from '~/types';
import { AxiosError } from '~/utils';
import { BenefitSchema } from '~/validators';
import { Switch } from '~/components/ui/switch';
import { Plus, X } from 'lucide-react';

type Props = {
   id?: string;
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onSuccess?: () => void;
};

function BenefitDialog({ id, open, onOpenChange, onSuccess }: Props) {
   const isEdit = !!id;
   const {
      register,
      control,
      handleSubmit,
      reset,
      formState: { isSubmitting, isDirty }
   } = useForm<BenefitForm>({
      resolver: zodResolver(BenefitSchema)
   });

   const init = useMemo(
      (): BenefitForm => ({
         i18n: [
            { lang: 'VI', title: '', items: [] },
            { lang: 'EN', title: '', items: [] }
         ],
         visible: false
      }),
      []
   );

   useEffect(() => {
      if (!open) return;
      if (id) {
         benefitService.getById(id).then(({ data }) => {
            reset(data ?? init);
         });
      } else {
         reset(init);
      }
   }, [open, id, init, reset]);

   const onSubmit = async (data: BenefitForm) => {
      try {
         await benefitService.upSert(id, data);
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
            className='sm:max-w-[425px] max-h-[90vh] overflow-y-auto'
         >
            <DialogHeader>
               <DialogTitle>
                  {isEdit ? 'Cập nhật lợi ích' : 'Thêm lợi ích mới'}
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
                  {LANGUAGES.map((lang, index) => (
                     <TabsContent
                        key={lang.value}
                        value={lang.value}
                        className='space-y-4'
                     >
                        <div className='space-y-2'>
                           <Label htmlFor={`title-${lang.value}`}>
                              Tiêu đề ({lang.label})
                           </Label>
                           <Input
                              id={`title-${lang.value}`}
                              {...register(`i18n.${index}.title`)}
                              autoFocus
                              disabled={isSubmitting}
                           />
                        </div>
                        <hr />
                        <Controller
                           name={`i18n.${index}.items`}
                           control={control}
                           render={({ field }) => {
                              const items = field.value || [];

                              return (
                                 <>
                                    <div className='flex justify-between items-center'>
                                       <h3 className='text-base font-medium'>
                                          Danh sách lợi ích ({lang.label})
                                       </h3>
                                       <Button
                                          type='button'
                                          size='icon-sm'
                                          variant='ghost'
                                          onClick={() =>
                                             field.onChange([...items, ''])
                                          }
                                          className='text-blue-500 hover:text-blue-600 cursor-pointer'
                                          disabled={isSubmitting}
                                       >
                                          <Plus />
                                       </Button>
                                    </div>
                                    {items.map((item, idx) => (
                                       <div
                                          key={idx}
                                          className='flex items-center gap-2'
                                       >
                                          <Input
                                             value={item}
                                             onChange={(e) => {
                                                const newItems = [...items];
                                                newItems[idx] = e.target.value;
                                                field.onChange(newItems);
                                             }}
                                             placeholder={`Lợi ích ${idx + 1}`}
                                             disabled={isSubmitting}
                                          />
                                          <Button
                                             type='button'
                                             variant='ghost'
                                             size='icon-sm'
                                             className='text-red-500 hover:text-red-600 cursor-pointer'
                                             onClick={() => {
                                                field.onChange(
                                                   items.filter(
                                                      (_, i) => i !== idx
                                                   )
                                                );
                                             }}
                                          >
                                             <X />
                                          </Button>
                                       </div>
                                    ))}
                                 </>
                              );
                           }}
                        />
                     </TabsContent>
                  ))}
               </Tabs>
               <hr />
               <div className='flex items-center gap-2'>
                  <Label htmlFor='active'>Hiển thị:</Label>
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

export default BenefitDialog;
