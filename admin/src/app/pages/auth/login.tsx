import { useEffect } from 'react';
import { LoginForm } from '~/components/form';

function LoginPage() {
  useEffect(() => {
    document.title = 'Administrator';
  }, []);

  return (
    <div className='bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
