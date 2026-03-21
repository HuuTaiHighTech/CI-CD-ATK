import {
   useFieldArray,
   type Control,
   type UseFormRegister
} from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import type { ProjectForm } from '~/types';
import { LANGUAGES } from '~/constants';

type Props = {
   index: number;
   register: UseFormRegister<ProjectForm>;
   control: Control<ProjectForm>;
   disabled?: boolean;
};

function DetailsForm({ index, register, control, disabled }: Props) {
   const { fields, append, remove } = useFieldArray({
      control,
      name: `i18n.${index}.details`
   });

   return (
      <>
         <div className='flex justify-between items-center space-y-3 border-t pt-4'>
            <h3>Chi tiết ({LANGUAGES[index].label})</h3>
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
                  placeholder='Tên'
                  {...register(`i18n.${index}.details.${i}.key`)}
                  disabled={disabled}
               />
               <Input
                  className='flex-1'
                  placeholder='Giá trị'
                  {...register(`i18n.${index}.details.${i}.value`)}
                  disabled={disabled}
               />
               <Button
                  type='button'
                  size='icon-sm'
                  variant='ghost'
                  className='text-red-500 hover:text-red-600 cursor-pointer'
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

export default DetailsForm;
