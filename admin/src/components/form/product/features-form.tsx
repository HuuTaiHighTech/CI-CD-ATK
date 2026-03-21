import {
  useFieldArray,
  type Control,
  type UseFormRegister
} from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import type { ProductForm } from '~/types';
import { LANGUAGES } from '~/constants';
import { Textarea } from '~/components/ui/textarea';

type Props = {
  index: number;
  register: UseFormRegister<ProductForm>;
  control: Control<ProductForm>;
  disabled?: boolean;
};

function FeaturesForm({ index, register, control, disabled }: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `i18n.${index}.features`
  });

  return (
    <>
      <div className='flex justify-between items-center space-y-3 border-t pt-4'>
        <h3>Đặc trưng ({LANGUAGES[index].label})</h3>
        <Button
          type='button'
          size='icon-sm'
          variant='ghost'
          onClick={() => append({ key: '', value: '' })}
          className='text-blue-500 hover:text-blue-600 cursor-pointer'
          disabled={disabled}
        >
          <Plus />
        </Button>
      </div>

      {fields.map((field, i) => (
        <div className='flex items-center gap-3 mt-3' key={field.id}>
          <Input
            className='flex-1'
            placeholder='Tên đặc trưng'
            {...register(`i18n.${index}.features.${i}.key`)}
            disabled={disabled}
          />
          <Textarea
            {...register(`i18n.${index}.features.${i}.value`)}
            placeholder='Giá trị'
            className='flex-1 min-h-9'
            maxLength={255}
            disabled={disabled}
          />
          <Button
            type='button'
            size='icon-sm'
            variant='ghost'
            className='text-red-500 hover:text-red-500 cursor-pointer'
            onClick={() => remove(i)}
            disabled={disabled}
          >
            <X />
          </Button>
        </div>
      ))}
    </>
  );
}

export default FeaturesForm;
