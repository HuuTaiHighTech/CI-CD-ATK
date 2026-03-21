import { MoveLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '~/components/ui/button';

function NotFoundPage() {
  const navigate = useNavigate();
  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };
  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <div className='flex flex-col gap-10'>
        <h3 className='text-xl font-bold uppercase'>
          404 | Không tìm thấy trang
        </h3>
        <Button variant={'link'} onClick={goBack}>
          <MoveLeft />
          Quay lại trang trước
        </Button>
      </div>
    </div>
  );
}

export default NotFoundPage;
