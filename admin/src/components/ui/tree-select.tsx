import { useState, useMemo } from 'react';
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
import { buildTree, cn, flattenTree, normalize } from '~/utils';
import type { TreeNode } from '~/types';

interface Option {
  id: string;
  name: string;
  parentId?: string | null;
}

interface Props {
  options: Option[];
  select?: string | null;
  onSelect?: (value: string | null) => void;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
}

function TreeSelect({
  options,
  select,
  disabled,
  onSelect,
  placeholder,
  emptyText = 'Không tìm thấy kết quả.',
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const tree = useMemo(() => buildTree<Option>(options), [options]);
  const flat = useMemo(() => flattenTree<Option>(tree), [tree]);
  const selected = useMemo(
    () => options.find((opt) => opt.id === select),
    [options, select]
  );

  const filter: TreeNode<Option>[] = useMemo(() => {
    if (!query) return flat;
    const q = normalize(query);
    return flat.filter((o) => normalize(o.name).includes(q));
  }, [flat, query]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
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
        <Command shouldFilter={false}>
          <CommandInput
            placeholder='Tìm kiếm...'
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {filter.map((opt) => (
                <CommandItem
                  key={opt.id}
                  value={opt.id}
                  onSelect={(v) => {
                    onSelect?.(v === select ? null : v);
                    setOpen(false);
                    setQuery('');
                  }}
                  className='cursor-pointer gap-2'
                >
                  <div
                    className='flex-1 truncate'
                    style={{
                      paddingLeft: `${opt.level * 1.2}rem`,
                    }}
                  >
                    {opt.name}
                  </div>
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

export default TreeSelect;
