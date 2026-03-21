import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuth from '~/hooks/use-auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import type { ProfileForm } from '~/types';
import { AxiosError } from '~/utils';
import { ProfileSchema } from '~/validators';
import { ROLE_MAP } from '~/constants';
import { useEffect } from 'react';

function InformationCard() {
  const { user, update } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isDirty }
  } = useForm<ProfileForm>({
    resolver: zodResolver(ProfileSchema)
  });

  useEffect(() => {
    if (user) reset(user);
  }, [user, reset]);

  const onSubmit = async (data: ProfileForm) => {
    try {
      await update(data);
      toast.success('Cập nhật thông tin thành công');
    } catch (error) {
      const { message } = AxiosError(error);
      toast.error(message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cá nhân</CardTitle>
        <CardDescription>
          Thực hiện thay đổi thông tin của bạn tại đây. Nhấp vào lưu khi bạn
          hoàn tất.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className='grid gap-6' onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <Label htmlFor='name'>Họ và tên</Label>
            <Input id='name' {...register('name')} disabled={isSubmitting} />
            {errors.name && (
              <p className='text-red-500 text-sm'>{errors.name.message}</p>
            )}
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='username'>Tên người dùng</Label>
            <Input
              id='username'
              {...register('username')}
              disabled={isSubmitting}
            />
            {errors.username && (
              <p className='text-red-500 text-sm'>{errors.username.message}</p>
            )}
          </div>
          <div className='grid gap-3'>
            <Label htmlFor='role'>Vai trò</Label>
            <Input
              id='role'
              defaultValue={ROLE_MAP[user?.role || '']}
              disabled
            />
          </div>
          <div>
            <Button
              type='submit'
              className='cursor-pointer'
              disabled={isSubmitting || !isDirty}
            >
              Cập nhật thông tin
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default InformationCard;
