import { MoveLeft } from 'lucide-react';
import {
   isRouteErrorResponse,
   useNavigate,
   useRouteError
} from 'react-router-dom';
import { Button } from '~/components/ui/button';

function ErrorBoundary() {
   const error = useRouteError();
   const navigate = useNavigate();

   let message = 'Lỗi không xác định';

   if (isRouteErrorResponse(error) || error instanceof Response) {
      switch (error.status) {
         case 404:
            message = '404 | Không tìm thấy trang';
            break;
         case 403:
            message = '403 | Không có quyền truy cập';
            break;
         default:
            break;
      }
   }

   const goBack = () => navigate(-1);

   return (
      <div className='w-full h-screen flex justify-center items-center'>
         <div className='flex flex-col gap-10'>
            <h3 className='text-xl font-bold uppercase'>{message}</h3>
            <Button variant={'link'} onClick={goBack}>
               <MoveLeft />
               Quay lại trang trước
            </Button>
         </div>
      </div>
   );
}

export default ErrorBoundary;
