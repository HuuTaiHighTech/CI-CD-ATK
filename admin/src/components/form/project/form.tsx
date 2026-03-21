import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
import { Switch } from '~/components/ui/switch';
import { LANGUAGES, ROUTES } from '~/constants';
import { projectService } from '~/services';
import type { ProjectForm as Project } from '~/types';
import { ProjectSchema } from '~/validators';
import { AxiosError } from '~/utils';
import { ImageUploader } from '~/components/ui/image-uploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import DetailsForm from '~/components/form/project/details-form';

interface Props {
   project?: Project;
}

function ProjectForm({ project }: Props) {
   const navigate = useNavigate();
   const [file, setFile] = useState<File | null>();

   const {
      register,
      handleSubmit,
      control,
      getValues,
      setValue,
      reset,
      formState: { isSubmitting, isDirty }
   } = useForm<Project>({
      resolver: zodResolver(ProjectSchema),
      defaultValues: {
         i18n: [
            { lang: 'VI', name: '' },
            { lang: 'EN', name: '' }
         ],
         visible: false
      }
   });

   useEffect(() => {
      if (project) reset(project);
   }, [project, reset]);

   const handleImageUpload = useCallback(
      (file: File | null) => {
         setFile(file);
         setValue('changed', true, { shouldDirty: true });
      },
      [setValue]
   );

   const onSubmit = async (form: Project) => {
      try {
         const { message, data } = await projectService.upSert(
            form.id,
            form,
            file
         );
         toast.success(message);
         if (form.id && data) {
            if (file) setFile(undefined);
            reset(data);
         } else {
            navigate(ROUTES.PROJECTS);
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
      () => navigate(ROUTES.PROJECTS),
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
                              Thông tin dự án
                           </CardTitle>
                           <CardDescription>
                              Nhập thông tin dự án cho từng ngôn ngữ
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
                     <Tabs defaultValue={LANGUAGES[0].value}>
                        <TabsList className='grid w-full grid-cols-2'>
                           {LANGUAGES.map((lang) => (
                              <TabsTrigger
                                 key={lang.value}
                                 value={lang.value}
                                 disabled={isSubmitting}
                              >
                                 {lang.label}
                              </TabsTrigger>
                           ))}
                        </TabsList>
                        {LANGUAGES.map((lang, index) => (
                           <TabsContent
                              key={lang.value}
                              value={lang.value}
                              className='space-y-4'
                           >
                              <div className='space-y-2'>
                                 <Label htmlFor={`name-${lang.value}`}>
                                    Tên dự án ({lang.label})
                                 </Label>
                                 <Input
                                    id={`name-${lang.value}`}
                                    {...register(`i18n.${index}.name`)}
                                 />
                              </div>
                              {/* details */}
                              <DetailsForm
                                 index={index}
                                 register={register}
                                 control={control}
                                 disabled={isSubmitting}
                              />
                           </TabsContent>
                        ))}
                     </Tabs>
                  </CardContent>
               </Card>
            </div>

            {/* Sidebar */}
            <div className='space-y-6'>
               {/* Image */}
               <Card>
                  <CardHeader>
                     <CardTitle>Hình ảnh</CardTitle>
                     <CardDescription>Tải lên hình ảnh dự án</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <ImageUploader
                        value={getValues('thumbnail')}
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

export default ProjectForm;
