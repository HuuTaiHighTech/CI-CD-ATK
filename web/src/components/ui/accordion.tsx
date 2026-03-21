import { cn } from '~/lib/utils';
import { Check, Plus } from 'lucide-react';

type Props = {
  title: string;
  items: string[];
  isOpen: boolean;
  onToggle: () => void;
};

function Accordion({ title, items, isOpen, onToggle }: Props) {
  return (
    <div className='bg-white border-[1.4px] border-accent rounded-2xl'>
      <div className='flex justify-between items-center p-4'>
        <h3 className='text-lg font-medium md:font-semibold text-accent'>
          {title}
        </h3>
        <button
          type='button'
          className='size-6 inline-flex justify-center items-center bg-accent text-white rounded-full cursor-pointer'
          onClick={onToggle}
        >
          <Plus
            className={cn(
              'size-4 shrink-0 transition-all duration-150',
              isOpen && '-rotate-45'
            )}
            strokeWidth={3}
          />
        </button>
      </div>
      <div
        className={cn(
          'invisible grid grid-rows-[0fr] transition-all duration-150 border-t border-dashed border-gray-400 overflow-hidden mx-4',
          isOpen && 'visible grid-rows-[1fr] py-3'
        )}
      >
        <ul className='min-h-0 space-y-3'>
          {items.map((item, index) => (
            <li key={index} className='inline-flex items-center gap-2'>
              <span className='size-4 inline-flex justify-center items-center text-white bg-blue-400 rounded-full shrink-0'>
                <Check className='size-2 shrink-0' strokeWidth={3} />
              </span>
              <span className='text-sm md:text-base'>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Accordion;
