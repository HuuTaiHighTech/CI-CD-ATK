import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import SortableUploader from '~/components/ui/sortable-uploader';
import { settingService } from '~/services';

function AboutPageCard() {
   const [images, setImages] = useState<(string | File)[]>([]);
   const [isLoading, setLoading] = useState<boolean>(false);

   const filterStrs = (arr?: (string | null)[]): string[] =>
      arr?.filter((i): i is string => !!i) || [];

   useEffect(() => {
      const init = async () => {
         try {
            setLoading(true);
            const { data } = await settingService.getAboutPage();
            setImages(filterStrs(data?.value));
         } catch {
            toast.error('Lỗi khi lấy dữ liệu');
         } finally {
            setLoading(false);
         }
      };
      init();
   }, []);

   const onImagesChange = useCallback((data: (string | File)[]) => {
      setImages(data);
   }, []);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         setLoading(true);
         const { data } = await settingService.updateAboutPage(images);
         setImages(data?.value);
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
            <CardTitle className='mb-2'>Hình ảnh giới thiệu</CardTitle>
            {/* <CardDescription>
               Đổi mật khẩu tại đây. Sau khi lưu, bạn sẽ được đăng xuất.
            </CardDescription> */}
         </CardHeader>
         <CardContent>
            <form className='grid gap-6' onSubmit={handleSubmit}>
               <SortableUploader
                  value={images}
                  aspect='3/5'
                  onChange={onImagesChange}
                  isLoading={isLoading}
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

export default AboutPageCard;
