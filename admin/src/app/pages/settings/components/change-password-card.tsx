import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Copy, RefreshCcw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { useCopyToClipboard } from '~/hooks';
import { authService } from '~/services';
import type { UpdatePassword } from '~/types';
import { AxiosError, generatePassword } from '~/utils';
import { UpdatePasswordSchema } from '~/validators';

function ChangePasswordCard() {
   const {
      register,
      handleSubmit,
      setValue,
      getValues,
      reset,
      formState: { isSubmitting, errors, isDirty }
   } = useForm<UpdatePassword>({
      resolver: zodResolver(UpdatePasswordSchema),
      defaultValues: { currentPassword: '', newPassword: '', confirm: '' }
   });
   const { copyToClipboard, isCopied } = useCopyToClipboard();

   const handleGeneratePassword = () => {
      const password = generatePassword();
      setValue('newPassword', password, { shouldDirty: true });
      setValue('confirm', password, { shouldDirty: true });
   };

   const handleCopy = () => {
      const password = getValues('newPassword');
      if (password.trim()) {
         copyToClipboard(password);
      }
   };

   const onSubmit = async (data: UpdatePassword) => {
      try {
         const { message } = await authService.update(data);
         reset();
         toast.success(message);
      } catch (error) {
         const { message } = AxiosError(error);
         toast.error(message);
      }
   };

   return (
      <Card>
         <CardHeader className='flex justify-between items-center'>
            <div>
               <CardTitle className='mb-2'>Đổi mật khẩu</CardTitle>
               <CardDescription>
                  Đổi mật khẩu tại đây. Sau khi lưu, bạn sẽ được đăng xuất.
               </CardDescription>
            </div>
            <Button
               type='button'
               className='cursor-pointer'
               variant={'outline'}
               onClick={handleGeneratePassword}
               disabled={isSubmitting}
            >
               <RefreshCcw /> Tạo
            </Button>
         </CardHeader>
         <CardContent>
            <form className='grid gap-6' onSubmit={handleSubmit(onSubmit)}>
               <div className='grid gap-2'>
                  <Label htmlFor='current-password'>Mật khẩu hiện tại</Label>
                  <Input
                     id='current-password'
                     type='password'
                     disabled={isSubmitting}
                     {...register('currentPassword')}
                  />
                  {errors.currentPassword && (
                     <p className='text-red-500 text-sm'>
                        {errors.currentPassword.message}
                     </p>
                  )}
               </div>
               <div className='grid gap-2'>
                  <Label htmlFor='new-password'>Mật khẩu mới</Label>
                  <div className='flex gap-2'>
                     <Input
                        id='new-password'
                        type='password'
                        {...register('newPassword')}
                        disabled={isSubmitting}
                     />
                     <Button
                        type='button'
                        size={'icon'}
                        className='cursor-pointer'
                        tabIndex={-1}
                        onClick={handleCopy}
                     >
                        {isCopied ? <Check /> : <Copy />}
                     </Button>
                  </div>
                  {errors.newPassword && (
                     <p className='text-red-500 text-sm'>
                        {errors.newPassword.message}
                     </p>
                  )}
               </div>
               <div className='grid gap-2'>
                  <Label htmlFor='confirm-password'>Xác nhận mật khẩu</Label>
                  <Input
                     id='confirm-password'
                     type='password'
                     {...register('confirm')}
                     disabled={isSubmitting}
                  />
                  {errors.confirm && (
                     <p className='text-red-500 text-sm'>
                        {errors.confirm.message}
                     </p>
                  )}
               </div>
               <div>
                  <Button
                     type='submit'
                     className='cursor-pointer'
                     disabled={isSubmitting || !isDirty}
                  >
                     Lưu mật khẩu
                  </Button>
               </div>
            </form>
         </CardContent>
      </Card>
   );
}

export default ChangePasswordCard;
