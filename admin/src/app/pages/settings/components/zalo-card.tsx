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
import { Input } from '~/components/ui/input';
import { settingService } from '~/services';

function ZaloCard() {
  const [image, setImage] = useState<string | undefined>(undefined);
  const [file, setFile] = useState<File | null>();
  const [phone, setPhone] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const { data } = await settingService.getZalo();
        setImage(data?.value?.qr);
        setPhone(data?.value?.phone ?? '');
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
      const { data } = await settingService.updateZalo(
        file,
        phone || undefined
      );
      setImage(data?.value?.qr);
      setPhone(data?.value?.phone ?? '');
      setFile(null);
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
        <CardTitle className='mb-2'>Zalo</CardTitle>
        {/* <CardDescription>
               Đổi mật khẩu tại đây. Sau khi lưu, bạn sẽ được đăng xuất.
            </CardDescription> */}
      </CardHeader>
      <CardContent>
        <form className='grid gap-6' onSubmit={handleSubmit}>
          <div className='w-80 mx-auto'>
            <Input
              type='tel'
              inputMode='numeric'
              placeholder='Số điện thoại'
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d+]/g, '');
                setPhone(value);
              }}
            />
          </div>
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

export default ZaloCard;
