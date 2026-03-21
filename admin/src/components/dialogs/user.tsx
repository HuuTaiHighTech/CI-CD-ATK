import { useCallback, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Copy, RefreshCcw } from 'lucide-react';
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
import {
   InputGroup,
   InputGroupAddon,
   InputGroupButton,
   InputGroupInput
} from '~/components/ui/input-group';
import { Label } from '~/components/ui/label';
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectTrigger,
   SelectValue
} from '~/components/ui/select';
import { Spinner } from '~/components/ui/spinner';
import { ROLES } from '~/constants';
import { useCopyToClipboard } from '~/hooks';
import { userService } from '~/services';
import type { UserForm, UserDto } from '~/types';
import { AxiosError, generatePassword } from '~/utils';
import { UserSchema } from '~/validators';
import { Switch } from '~/components/ui/switch';

type Props = {
   user?: UserDto;
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onSuccess?: () => void;
};

function UserDialog({ user, open, onOpenChange, onSuccess }: Props) {
   const isEdit = !!user;
   const { copyToClipboard, isCopied } = useCopyToClipboard();
   const {
      register,
      handleSubmit,
      getValues,
      setValue,
      reset,
      control,
      formState: { isSubmitting, errors, isDirty }
   } = useForm<UserForm>({ resolver: zodResolver(UserSchema) });

   useEffect(() => {
      if (isEdit) {
         reset({
            ...user,
            mode: 'update',
            password: null
         });
      } else {
         reset({
            mode: 'create',
            name: '',
            username: '',
            password: '',
            role: 'USER',
            active: false
         });
      }
   }, [isEdit, reset, user]);

   const handleGenerate = useCallback(() => {
      const password = generatePassword();
      setValue('password', password, {
         shouldValidate: true,
         shouldDirty: true
      });
   }, [setValue]);

   const onSubmit = async (data: UserForm) => {
      try {
         await userService.upSert(user?.id || null, data);
         toast.success(isEdit ? 'Cập nhật thành công!' : 'Thêm thành công!');
         onSuccess?.();
         if (isEdit) {
            reset({ ...data, password: null });
         } else {
            reset();
         }
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
                  {isEdit ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}
               </DialogTitle>
               <DialogDescription>
                  Make changes to your profile here. Click save when you&apos;re
                  done.
               </DialogDescription>
            </DialogHeader>
            <form className='grid gap-3' onSubmit={handleSubmit(onSubmit)}>
               <div className='grid gap-2'>
                  <Label htmlFor='name'>Họ và tên</Label>
                  <Input id='name' {...register('name')} />
                  {errors.name && (
                     <p className='text-red-500 text-sm'>
                        {errors.name.message}
                     </p>
                  )}
               </div>
               <div className='grid gap-2'>
                  <Label htmlFor='username'>Tên người dùng</Label>
                  <Input id='username' {...register('username')} />
                  {errors.username && (
                     <p className='text-red-500 text-sm'>
                        {errors.username.message}
                     </p>
                  )}
               </div>
               <div className='grid gap-2'>
                  <Label htmlFor='password'>Mật khẩu</Label>
                  <div className='flex gap-2'>
                     <InputGroup>
                        <InputGroupInput
                           id='password'
                           type='password'
                           {...register('password')}
                        />
                        <InputGroupAddon align='inline-end'>
                           <InputGroupButton
                              aria-label='Copy'
                              title='Copy'
                              size='icon-xs'
                              className='cursor-pointer'
                              tabIndex={-1}
                              onClick={() => {
                                 const password = getValues('password');
                                 if (password?.trim()) {
                                    copyToClipboard(password);
                                 }
                              }}
                           >
                              {isCopied ? <Check /> : <Copy />}
                           </InputGroupButton>
                        </InputGroupAddon>
                     </InputGroup>
                     <Button
                        type='button'
                        variant={'ghost'}
                        className='cursor-pointer'
                        onClick={handleGenerate}
                        disabled={isSubmitting}
                        tabIndex={-1}
                     >
                        <RefreshCcw />
                     </Button>
                  </div>
                  {errors.password && (
                     <p className='text-red-500 text-sm'>
                        {errors.password.message}
                     </p>
                  )}
               </div>
               <div className='flex items-center gap-3'>
                  <div className='flex-1 flex items-center gap-2'>
                     <Label htmlFor='role' className='inline-block'>
                        Vai trò
                     </Label>
                     <Controller
                        name='role'
                        control={control}
                        render={({ field }) => (
                           <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={isSubmitting}
                           >
                              <SelectTrigger className='flex-1'>
                                 <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectGroup>
                                    {ROLES.map((role) => (
                                       <SelectItem
                                          key={role.value}
                                          value={role.value}
                                       >
                                          {role.label}
                                       </SelectItem>
                                    ))}
                                 </SelectGroup>
                              </SelectContent>
                           </Select>
                        )}
                     />
                  </div>
                  <div className='flex items-center gap-2'>
                     <Label htmlFor='active'>Kích hoạt:</Label>
                     <Controller
                        name='active'
                        control={control}
                        render={({ field }) => (
                           <Switch
                              id='active'
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className='cursor-pointer'
                              disabled={isSubmitting}
                           />
                        )}
                     />
                  </div>
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

export default UserDialog;
