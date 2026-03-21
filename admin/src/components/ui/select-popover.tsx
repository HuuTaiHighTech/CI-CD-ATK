import { useMemo } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '~/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '~/components/ui/command';
import { cn } from '~/utils';

interface Option {
  id: string;
  name: string;
}

interface Props {
  options: Option[];
  select?: string | null;
  onSelect?: (value: string | null) => void;
  placeholder?: string;
  emptyText?: string;
  searchable?: boolean;
  disabled?: boolean;
}

function SelectPopover({
  options,
  select,
  onSelect,
  placeholder,
  emptyText = 'Không tìm thấy kết quả.',
  searchable = true,
  disabled,
}: Props) {
  const selected = useMemo(
    () => options.find((opt) => opt.id === select),
    [options, select]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          type='button'
          className='w-full justify-between bg-transparent cursor-pointer'
          disabled={disabled}
        >
          <span
            className={cn(
              'flex-1 text-left',
              !select && 'text-neutral-500 dark:text-neutral-400'
            )}
          >
            {selected ? selected.name : placeholder}
          </span>
          <ChevronDown className='size-4 shrink-0 opacity-50 ml-2' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-(--radix-popover-trigger-width) p-0'
        align='start'
      >
        <Command>
          {searchable && <CommandInput placeholder='Tìm kiếm...' />}
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.id}
                  value={opt.id}
                  onSelect={(v) => {
                    onSelect?.(v === select ? null : v);
                  }}
                  className='cursor-pointer gap-2'
                >
                  <div className='flex-1 truncate'>{opt.name}</div>
                  {select === opt.id && <Check className='shrink-0' />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default SelectPopover;
