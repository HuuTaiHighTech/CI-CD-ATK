import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ProductI18nForm from '~/components/form/product/i18n-form';
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
import { categoryService, productService, tagService } from '~/services';
import type { ProductForm as Product, CategorySelect, Tag } from '~/types';
import SortableUploader from '~/components/ui/sortable-uploader';
import TagSelect from '~/components/ui/tag-select';
import { ProductSchema } from '~/validators';
import { AxiosError } from '~/utils';

interface Props {
   product?: Product;
}

function ProductForm({ product }: Props) {
   const navigate = useNavigate();
   const [categories, setCategories] = useState<CategorySelect[]>([]);
   const [tags, setTags] = useState<Tag[]>([]);
   const [images, setImages] = useState<(string | File)[]>([]);

   const {
      register,
      handleSubmit,
      reset,
      control,
      setValue,
      formState: { isSubmitting, isDirty }
   } = useForm<Product>({
      resolver: zodResolver(ProductSchema),
      defaultValues: {
         i18n: [
            { lang: 'VI', name: '' },
            { lang: 'EN', name: '' }
         ],
         visible: false
      }
   });

   const filterStrs = (arr?: (string | null)[]): string[] =>
      arr?.filter((i): i is string => !!i) || [];

   const fetchInitial = useCallback(async () => {
      try {
         const [categories, tags] = await Promise.all([
            categoryService.getSummary(),
            tagService.get()
         ]);

         setCategories(categories.data || []);
         setTags(tags.data || []);
      } catch (error) {
         const { message } = AxiosError(error);
         toast.error(message);
      }
   }, []);

   useEffect(() => {
      if (product) {
         reset(product);
         setImages(filterStrs(product.images));
      }
      fetchInitial();
   }, [fetchInitial, product, reset]);

   const onImagesChange = useCallback(
      (data: (string | File)[]) => {
         setImages(data);
         setValue('changed', true, { shouldDirty: true });
      },
      [setValue]
   );

   const onSubmit = async (form: Product) => {
      try {
         const { message, data } = await productService.upSert(
            form.id,
            form,
            images
         );
         toast.success(message);
         if (form.id && data) {
            setImages(filterStrs(data.images));
            reset(data);
         } else {
            navigate(ROUTES.PRODUCTS);
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
      () => navigate(ROUTES.PRODUCTS),
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
                              Thông tin sản phẩm
                           </CardTitle>
                           <CardDescription>
                              Nhập thông tin sản phẩm cho từng ngôn ngữ
                           </CardDescription>
                        </div>
                        <Controller
                           name='visible'
                           control={control}
                           render={({ field }) => (
                              <Switch
                                 id='visible'
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
                     <ProductI18nForm
                        control={control}
                        register={register}
                        isSubmitting={isSubmitting}
                     />
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
                        aspect='3/4'
                        onChange={onImagesChange}
                        isLoading={isSubmitting}
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
                     <CardDescription>
                        Chọn danh mục cho sản phẩm
                     </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <Controller
                        name='categoryId'
                        control={control}
                        render={({ field }) => (
                           <TreeSelect
                              options={categories}
                              select={field.value}
                              onSelect={field.onChange}
                              placeholder='Chọn danh mục'
                              disabled={isSubmitting}
                           />
                        )}
                     />
                  </CardContent>
               </Card>

               {/* Tags */}
               <Card>
                  <CardHeader>
                     <CardTitle>Thẻ</CardTitle>
                     <CardDescription>
                        Chọn danh sách thẻ cho bài viết
                     </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <Controller
                        name='tags'
                        control={control}
                        render={({ field }) => (
                           <TagSelect
                              placeholder='Chọn thẻ'
                              options={tags}
                              select={field.value}
                              onSelect={field.onChange}
                              disabled={isSubmitting}
                           />
                        )}
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

export default ProductForm;
