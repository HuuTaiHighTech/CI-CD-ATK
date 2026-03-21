import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import {
   Card,
   CardContent,
   //    CardDescription,
   CardHeader,
   CardTitle
} from '~/components/ui/card';
import { ImageUploader } from '~/components/ui/image-uploader';
import { settingService } from '~/services';

function AddressImageCard() {
   const [image, setImage] = useState<string | undefined>(undefined);
   const [file, setFile] = useState<File | null>();
   const [isLoading, setLoading] = useState<boolean>(false);

   useEffect(() => {
      const init = async () => {
         try {
            setLoading(true);
            const { data } = await settingService.getAddressInage();
            setImage(data?.value);
         } catch {
            toast.error('Lỗi khi lấy dữ liệu');
         } finally {
            setLoading(false);
         }
      };
      init();
   }, []);

   const handleImageUpload = useCallback((file: File | null) => {
      setFile(file);
   }, []);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         setLoading(true);
         const { data } = await settingService.updateAddressInage(file);
         setImage(data?.value);
         toast.success('Cập nhật thành công');
      } catch {
         toast.error('Lỗi khi tải ảnh');
      } finally {
         setLoading(false);
      }
   };

   return (
      <Card>
         <CardHeader>
            <CardTitle className='mb-2'>Hình ảnh địa chỉ</CardTitle>
            {/* <CardDescription>
               Đổi mật khẩu tại đây. Sau khi lưu, bạn sẽ được đăng xuất.
            </CardDescription> */}
         </CardHeader>
         <CardContent>
            <form className='grid gap-6' onSubmit={handleSubmit}>
               <ImageUploader
                  value={image}
                  onChange={handleImageUpload}
                  disabled={isLoading}
               />
               <div className='mt-auto'>
                  <Button
                     type='submit'
                     className='cursor-pointer'
                     disabled={isLoading}
                  >
                     Lưu
                  </Button>
               </div>
            </form>
         </CardContent>
      </Card>
   );
}

export default AddressImageCard;
