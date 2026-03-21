import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Field } from '~/components/ui/field';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '~/components/ui/popover';
import { type DateRange } from 'react-day-picker';

type Props = {
  value?: DateRange;
  onChange: (value: DateRange | undefined) => void;
};

export function DatePickerWithRange({ value, onChange }: Props) {
  const [date, setDate] = useState<DateRange | undefined>();

  return (
    <Field className='w-fit'>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type='button'
            variant='outline'
            id='date-picker-range'
            className='justify-start px-2.5 font-normal cursor-pointer'
          >
            <CalendarIcon />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, 'LLL dd, y')} -{' '}
                  {format(value.to, 'LLL dd, y')}
                </>
              ) : (
                format(value.from, 'LLL dd, y')
              )
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            mode='range'
            defaultMonth={value?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
          <div className='text-right pr-3 pb-3'>
            <Button
              type='button'
              size='sm'
              className='cursor-pointer'
              onClick={() => onChange(date)}
            >
              Áp dụng
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </Field>
  );
}
