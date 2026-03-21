import { useCallback, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PostI18nForm from '~/components/form/post/i18n-form';
import TagSelect from '~/components/ui/tag-select';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { ImageUploader } from '~/components/ui/image-uploader';
import { Spinner } from '~/components/ui/spinner';
import { Switch } from '~/components/ui/switch';
import { GROUPS, ROUTES } from '~/constants';
import { categoryService, postService, tagService } from '~/services';
import type { CategorySelect, PostForm as Post, Tag } from '~/types';
import { AxiosError } from '~/utils';
import { PostSchema } from '~/validators';
import TreeSelect from '~/components/ui/tree-select';
import SelectPopover from '~/components/ui/select-popover';

interface Props {
  post?: Post;
}

function PostForm({ post }: Props) {
  const navigate = useNavigate();
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<CategorySelect[]>([]);
  const [file, setFile] = useState<File | null>();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    getValues,
    formState: { isSubmitting, isDirty },
  } = useForm<Post>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      i18n: [
        { lang: 'VI', title: '' },
        { lang: 'EN', title: '' },
      ],
      relate: [],
      hot: false,
      published: false,
    },
  });

  const fetchInit = useCallback(async () => {
    try {
      const [categories, tags] = await Promise.all([
        categoryService.getSummary(),
        tagService.get(),
      ]);

      setCategories(categories.data || []);
      setTags(tags.data || []);
    } catch (error) {
      const { message } = AxiosError(error);
      toast.error(message);
    }
  }, []);

  useEffect(() => {
    fetchInit();
  }, [fetchInit]);

  useEffect(() => {
    if (post) reset(post);
  }, [post, reset]);

  const handleImageUpload = useCallback(
    (file: File | null) => {
      setFile(file);
      setValue('changed', true, { shouldDirty: true });
    },
    [setValue]
  );

  const onSubmit = async (form: Post) => {
    try {
      const { message, data } = await postService.upSert(form.id, form, file);
      toast.success(message);
      if (form.id && data) {
        if (file) setFile(undefined);
        reset(data);
      } else {
        navigate(ROUTES.POSTS);
      }
    } catch (error) {
      const { message } = AxiosError(error);
      toast.error(message);
    }
  };

  const onError = useCallback(() => {
    toast.warning('Kiểm tra dữ liệu nhập vào');
  }, []);

  const handleCancel = useCallback(() => navigate(ROUTES.POSTS), [navigate]);

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
                  <CardTitle className='mb-2'>Thông tin bài viết</CardTitle>
                  <CardDescription>
                    Nhập thông tin bài viết cho từng ngôn ngữ
                  </CardDescription>
                </div>
                <Controller
                  name='published'
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id='published'
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
              <PostI18nForm
                control={control}
                isSubmitting={isSubmitting}
                register={register}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Hot */}
          <Card>
            <CardHeader className='flex justify-between items-center'>
              <div className='space-y-2'>
                <CardTitle>Hiển thị nổi bật</CardTitle>
                <CardDescription>
                  Khi bật, bài viết này sẽ xuất hiện ở nổi bật. Tắt thì chỉ hiện
                  trong danh sách thường.
                </CardDescription>
              </div>
              <Controller
                name='hot'
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
            </CardHeader>
            <CardContent></CardContent>
          </Card>

          {/* Image */}
          <Card>
            <CardHeader>
              <CardTitle>Hình ảnh</CardTitle>
              <CardDescription>Tải lên hình ảnh cho bài viết</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploader
                value={getValues('thumbnail')}
                onChange={handleImageUpload}
                disabled={isSubmitting}
              />
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle>Danh mục</CardTitle>
              <CardDescription>Chọn danh mục cho bài viết</CardDescription>
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

          {/* Group  */}
          <Card>
            <CardHeader>
              <CardTitle>Nhóm</CardTitle>
              <CardDescription>Chọn nhóm cho bài viết</CardDescription>
            </CardHeader>
            <CardContent>
              <Controller
                name='group'
                control={control}
                render={({ field }) => (
                  <SelectPopover
                    placeholder='Chọn nhóm'
                    options={GROUPS.map((gr) => ({
                      id: gr.value,
                      name: gr.label,
                    }))}
                    searchable={false}
                    select={field.value}
                    onSelect={field.onChange}
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
              <CardDescription>Chọn danh sách thẻ cho bài viết</CardDescription>
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

          {/* Relate */}
          <Card>
            <CardHeader>
              <CardTitle>Bài viết liên quan</CardTitle>
              <CardDescription>
                Hiển thị ở phần bài viết liên quan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Controller
                name='relate'
                control={control}
                render={({ field }) => (
                  <TagSelect
                    placeholder='Liên quan'
                    options={GROUPS.map((gr) => ({
                      id: gr.value,
                      name: gr.label,
                    }))}
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
      </div>
    </form>
  );
}

export default PostForm;
