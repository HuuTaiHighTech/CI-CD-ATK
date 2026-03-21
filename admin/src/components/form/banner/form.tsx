import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card';
import { Spinner } from '~/components/ui/spinner';
import { ROUTES } from '~/constants';
import { bannerService } from '~/services';
import type { BannerForm as Banner } from '~/types';
import SortableUploader from '~/components/ui/sortable-uploader';
import { BannerSchema } from '~/validators';
import { AxiosError } from '~/utils';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';

interface Props {
  banner?: Banner;
}

function BannerForm({ banner }: Props) {
  const navigate = useNavigate();
  const [images, setImages] = useState<(string | File)[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, isDirty }
  } = useForm<Banner>({
    resolver: zodResolver(BannerSchema)
  });

  const filterStrs = (arr?: (string | null)[]): string[] =>
    arr?.filter((i): i is string => !!i) || [];

  useEffect(() => {
    if (banner) {
      reset(banner);
      setImages(filterStrs(banner.images));
    }
  }, [banner, reset]);

  const onImagesChange = useCallback(
    (data: (string | File)[]) => {
      setImages(data);
      setValue('changed', true, { shouldDirty: true });
    },
    [setValue]
  );

  const onSubmit = async (form: Banner) => {
    try {
      const { message, data } = await bannerService.upSert(
        form.id,
        form,
        images
      );
      toast.success(message);
      if (form.id && data) {
        setImages(filterStrs(data.images));
        reset(data);
      } else {
        navigate(ROUTES.BANNERS);
      }
    } catch (error) {
      const { message } = AxiosError(error);
      toast.error(message);
    }
  };

  const onError = useCallback(() => {
    toast.warning('Kiểm tra dữ liệu nhập vào');
  }, []);

  const handleCancel = useCallback(() => navigate(ROUTES.BANNERS), [navigate]);

  return (
    <form className='space-y-6' onSubmit={handleSubmit(onSubmit, onError)}>
      <div className='space-y-6'>
        {/* Information */}
        <Card>
          <CardHeader>
            <CardTitle className='mb-2'>Thông tin sản phẩm</CardTitle>
            <CardDescription>
              Nhập thông tin sản phẩm cho từng ngôn ngữ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-2 mb-5'>
              <Label htmlFor='key'>Key</Label>
              <Input id='key' {...register('key')} />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='name'>Name</Label>
              <Input id='name' {...register('name')} />
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Hình ảnh sản phẩm</CardTitle>
            <CardDescription>
              Tải lên hình ảnh sản phẩm (tối đa 10 ảnh)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SortableUploader
              value={images}
              aspect='8/3'
              onChange={onImagesChange}
              isLoading={isSubmitting}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent>
            <div className='flex flex-col lg:flex-row-reverse gap-3'>
              <Button
                type='submit'
                className='flex-1 cursor-pointer'
                disabled={isSubmitting || !isDirty}
              >
                {isSubmitting ? <Spinner /> : <Save className='size-4' />}
                Lưu
              </Button>
              <Button
                type='button'
                variant='outline'
                className='flex-1 bg-transparent cursor-pointer'
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <X className='size-4' />
                Hủy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}

export default BannerForm;
