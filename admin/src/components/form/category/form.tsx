import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import TreeSelect from '~/components/ui/tree-select';
import { Button } from '~/components/ui/button';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle
} from '~/components/ui/card';
import { Spinner } from '~/components/ui/spinner';
import { Switch } from '~/components/ui/switch';
import { ROUTES } from '~/constants';
import { categoryService } from '~/services';
import type { CategoryForm as Category, CategorySelect } from '~/types';
import { AxiosError } from '~/utils';
import { CategorySchema } from '~/validators';
import CategoryI18nForm from '~/components/form/category/i18n-form';
import { ImageUploader } from '~/components/ui/image-uploader';

interface Props {
   category?: Category;
}

function CategoryForm({ category }: Props) {
   const navigate = useNavigate();
   const [categories, setCategories] = useState<CategorySelect[]>([]);
   const [file, setFile] = useState<File | null>();

   const {
      register,
      handleSubmit,
      reset,
      control,
      setValue,
      getValues,

      formState: { isSubmitting, isDirty }
   } = useForm<Category>({
      resolver: zodResolver(CategorySchema),
      defaultValues: {
         i18n: [
            { lang: 'VI', name: '' },
            { lang: 'EN', name: '' }
         ],
         visible: false
      }
   });

   const fetchCatgories = useCallback(async (id?: string) => {
      try {
         const { data } = await categoryService.getSummary(id);
         if (data) setCategories(data);
      } catch (error) {
         const { message } = AxiosError(error);
         toast.error(message);
      }
   }, []);

   useEffect(() => {
      if (category) reset(category);
      fetchCatgories(category?.id);
   }, [category, fetchCatgories, reset]);

   const handleImageUpload = useCallback(
      (file: File | null) => {
         setFile(file);
         setValue('changed', true, { shouldDirty: true });
      },
      [setValue]
   );

   const onSubmit = async (form: Category) => {
      try {
         const { message, data } = await categoryService.upSert(
            form.id,
            form,
            file
         );
         toast.success(message);
         if (form.id && data) {
            if (file) setFile(undefined);
            reset(data);
         } else {
            navigate(ROUTES.CATEGORIES);
         }
      } catch (error) {
         const { message } = AxiosError(error);
         toast.error(message);
      }
   };

   const onError = useCallback(() => {
      toast.warning('Kiểm tra dữ liệu nhập vào');
   }, []);

   const handleCancel = useCallback(
      () => navigate(ROUTES.CATEGORIES),
      [navigate]
   );

   return (
      <form className='space-y-6' onSubmit={handleSubmit(onSubmit, onError)}>
         <div className='grid gap-6 lg:grid-cols-3'>
            {/* Main Content */}
            <div className='lg:col-span-2 space-y-6'>
               {/* Language Tabs */}
               <Card>
                  <CardHeader>
                     <div className='flex items-center justify-between'>
                        <div>
                           <CardTitle className='mb-2'>
                              Thông tin danh mục
                           </CardTitle>
                           <CardDescription>
                              Nhập thông tin danh mục cho từng ngôn ngữ
                           </CardDescription>
                        </div>
                        <Controller
                           name='visible'
                           control={control}
                           render={({ field }) => (
                              <Switch
                                 className='cursor-pointer'
                                 checked={field.value}
                                 onCheckedChange={field.onChange}
                                 disabled={isSubmitting}
                              />
                           )}
                        />
                     </div>
                  </CardHeader>
                  <CardContent>
                     <CategoryI18nForm
                        control={control}
                        isSubmitting={isSubmitting}
                        register={register}
                     />
                  </CardContent>
               </Card>
            </div>

            {/* Sidebar */}
            <div className='space-y-6'>
               {/* Category */}
               <Card>
                  <CardHeader>
                     <CardTitle>Danh mục</CardTitle>
                     <CardDescription>Chọn danh mục cấp cha</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <Controller
                        name='parentId'
                        control={control}
                        render={({ field }) => (
                           <TreeSelect
                              options={categories}
                              select={field.value}
                              onSelect={field.onChange}
                              placeholder='Chọn danh mục cha'
                              disabled={isSubmitting}
                           />
                        )}
                     />
                  </CardContent>
               </Card>

               {/* Image */}
               <Card>
                  <CardHeader>
                     <CardTitle>Hình ảnh</CardTitle>
                     <CardDescription>
                        Tải lên hình ảnh danh mục
                     </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <ImageUploader
                        value={getValues('image')}
                        onChange={handleImageUpload}
                        disabled={isSubmitting}
                     />
                  </CardContent>
               </Card>
               {/* Actions */}
               <Card>
                  <CardContent>
                     <div className='flex flex-col md:flex-row-reverse gap-3'>
                        <Button
                           type='submit'
                           className='flex-1 cursor-pointer'
                           disabled={isSubmitting || !isDirty}
                        >
                           {isSubmitting ? (
                              <Spinner />
                           ) : (
                              <Save className='size-4' />
                           )}
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
         </div>
      </form>
   );
}

export default CategoryForm;
