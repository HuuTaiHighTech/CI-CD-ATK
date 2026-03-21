import {
  Controller,
  type Control,
  type UseFormRegister
} from 'react-hook-form';
import FeaturesForm from '~/components/form/product/features-form';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import TextEditor from '~/components/ui/text-editor';
import { Textarea } from '~/components/ui/textarea';
import { LANGUAGES } from '~/constants';
import type { ProductForm } from '~/types';

type Props = {
  register: UseFormRegister<ProductForm>;
  control: Control<ProductForm>;
  isSubmitting: boolean;
};

function ProductI18nForm({ register, control, isSubmitting }: Props) {
  return (
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
        <TabsContent key={lang.value} value={lang.value} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor={`name-${lang.value}`}>
              Tên sản phẩm ({lang.label})
            </Label>
            <Input
              id={`name-${lang.value}`}
              {...register(`i18n.${index}.name`)}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor={`summary-${lang.value}`}>
              Bản tóm tắt ({lang.label})
            </Label>
            <Textarea
              id={`summary-${lang.value}`}
              {...register(`i18n.${index}.summary`)}
              className='h-32 resize-none'
              maxLength={255}
            />
          </div>
          <div className='space-y-2'>
            <Label>Mô tả ({lang.label})</Label>
            <Controller
              key={index}
              name={`i18n.${index}.description`}
              control={control}
              render={({ field }) => (
                <TextEditor
                  content={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                />
              )}
            />
          </div>
          <FeaturesForm
            index={index}
            register={register}
            control={control}
            disabled={isSubmitting}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}

export default ProductI18nForm;
