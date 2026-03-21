import {
  Controller,
  type Control,
  type UseFormRegister
} from 'react-hook-form';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import TextEditor from '~/components/ui/text-editor';
import { LANGUAGES } from '~/constants';
import type { CategoryForm } from '~/types';

type Props = {
  register: UseFormRegister<CategoryForm>;
  control: Control<CategoryForm>;
  isSubmitting: boolean;
};

function CategoryI18nForm({ register, control, isSubmitting }: Props) {
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
      {LANGUAGES.map((lang, index) => {
        return (
          <TabsContent
            value={lang.value}
            className='space-y-4'
            key={lang.value}
          >
            <div className='space-y-2'>
              <Label htmlFor={`name-${lang.value}`}>
                Tên danh mục ({lang.label})
              </Label>
              <Input
                id={`name-${lang.value}`}
                {...register(`i18n.${index}.name`)}
                disabled={isSubmitting}
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
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

export default CategoryI18nForm;
