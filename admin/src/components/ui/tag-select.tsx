import { useCallback, useMemo } from 'react';
import { CheckIcon } from 'lucide-react';
import {
   Tags,
   TagsContent,
   TagsEmpty,
   TagsGroup,
   TagsInput,
   TagsItem,
   TagsList,
   TagsTrigger,
   TagsValue
} from '~/components/ui/tag';
import { normalize } from '~/utils';

export interface Option {
   id: string;
   name: string;
}

interface Props {
   options?: Option[];
   select?: string[];
   onSelect?: (value: string[]) => void;
   placeholder?: string;
   emptyText?: string;
   disabled?: boolean;
}

function TagSelect({
   options = [],
   select = [],
   placeholder,
   emptyText = 'Không tìm thấy.',
   disabled,
   onSelect
}: Props) {
   const toggle = useCallback(
      (id: string) => {
         if (disabled) return;
         if (select.includes(id)) {
            onSelect?.(select.filter((s) => s !== id));
         } else {
            onSelect?.([...select, id]);
         }
      },
      [select, onSelect, disabled]
   );

   const remove = useCallback(
      (id: string) => () => {
         if (disabled) return;
         onSelect?.(select.filter((s) => s !== id));
      },
      [select, onSelect, disabled]
   );

   const map = useMemo(() => {
      const map: Record<string, string> = {};
      options.forEach((o) => (map[o.id] = o.name));
      return map;
   }, [options]);

   return (
      <Tags className='w-full'>
         <TagsTrigger
            placeholder={!select.length ? placeholder : undefined}
            disabled={disabled}
         >
            {select.map((id) => (
               <TagsValue key={id} onRemove={remove(id)}>
                  {map[id]}
               </TagsValue>
            ))}
         </TagsTrigger>
         <TagsContent
            className='w-[var(--radix-popover-trigger-width)]'
            align='start'
            filter={(value, search) => {
               const name = map[value] ?? '';
               return normalize(name).includes(normalize(search)) ? 1 : 0;
            }}
         >
            <TagsInput placeholder='Tìm kiếm...' />
            <TagsList>
               <TagsEmpty>{emptyText}</TagsEmpty>
               <TagsGroup>
                  {options.map((opt) => (
                     <TagsItem key={opt.id} onSelect={toggle} value={opt.id}>
                        {opt.name}
                        {select.includes(opt.id) && (
                           <CheckIcon
                              className='text-muted-foreground shrink-0'
                              size={14}
                           />
                        )}
                     </TagsItem>
                  ))}
               </TagsGroup>
            </TagsList>
         </TagsContent>
      </Tags>
   );
}

export default TagSelect;
