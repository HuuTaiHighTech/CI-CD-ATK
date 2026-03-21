import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { LockIcon, User } from 'lucide-react';
import { AxiosError, cn } from '~/utils';
import { Button } from '~/components/ui/button';
import { Field, FieldGroup } from '~/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '~/components/ui/input-group';
import useAuth from '~/hooks/use-auth';
import Logo from '~/assets/Logo.png';

const loginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().trim().min(1)
});

type Form = z.infer<typeof loginSchema>;

function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const { signIn } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid }
  } = useForm<Form>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' }
  });

  const onSubmit = async (data: Form) => {
    try {
      await signIn(data);
    } catch (error) {
      const { message } = AxiosError(error);
      toast.error(message);
    }
  };

  return (
    <div className={cn('flex flex-col gap-10', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className='flex flex-col items-center gap-2 text-center mb-5'>
            <img src={Logo} alt='Logo' className='w-1/2' />
          </div>
          <InputGroup>
            <InputGroupInput
              type='text'
              {...register('username')}
              disabled={isSubmitting}
              autoFocus
            />
            <InputGroupAddon>
              <User />
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput
              type='password'
              {...register('password')}
              disabled={isSubmitting}
            />
            <InputGroupAddon>
              <LockIcon />
            </InputGroupAddon>
          </InputGroup>
          <Field>
            <Button
              type='submit'
              className='cursor-pointer'
              disabled={isSubmitting || !isValid}
            >
              Đăng nhập
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}

export default LoginForm;
