'use client';

import {
  type LucideIcon,
  Check,
  CircleAlert,
  TriangleAlert,
  X
} from 'lucide-react';
import Portal from '~/components/portal';
import { useDialog } from '~/context/dialog-context';
import { useLocale } from '~/context/locale-context';
import { cn } from '~/lib/utils';

type Type = 'success' | 'error' | 'warning' | 'info';

type Config = {
  icon: LucideIcon;
  iconClass: string;
  titleClass: string;
  buttonClass: string;
};

function AlertDialog() {
  const { dictionary } = useLocale();
  const { dialog } = useDialog();
  if (!dialog.open) return null;

  const config = dialog.type ? TYPE_MAP[dialog.type] : null;

  return (
    <Portal>
      <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'>
        <div className='w-sm sm:w-md max-w-4/5 bg-white rounded-2xl shadow-lg p-5 lg:p-8'>
          {config && (
            <div
              className={cn(
                'size-16 aspect-square flex justify-center items-center rounded-full mx-auto mb-3',
                config.iconClass
              )}
            >
              <config.icon className='size-8 text-white stroke-3 shrink-0' />
            </div>
          )}
          <h3 className='text-lg font-semibold text-center'>{dialog.title}</h3>
          {dialog.text && (
            <p className='text-sm text-gray-600 text-center'>{dialog.text}</p>
          )}
          <div className='flex justify-around items-center gap-2 mt-6'>
            {dialog.resolve?.length === 1 && (
              <button
                type='button'
                onClick={() => dialog.resolve?.(false)}
                className='text-sm border border-gray-200 rounded-full select-none cursor-pointer px-5 py-2'
              >
                {dictionary.cancel}
              </button>
            )}
            <button
              type='button'
              onClick={() => dialog.resolve?.(true)}
              className={cn(
                'text-white text-sm rounded-full select-none cursor-pointer px-5 py-2',
                config?.buttonClass ?? 'bg-accent'
              )}
            >
              {dictionary.confirm}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

export default AlertDialog;

const TYPE_MAP: Record<Type, Config> = {
  success: {
    icon: Check,
    iconClass: 'bg-blue-600',
    titleClass: '',
    buttonClass: 'bg-blue-600'
  },
  error: {
    icon: X,
    iconClass: 'bg-red-600',
    titleClass: '',
    buttonClass: 'bg-red-600'
  },
  warning: {
    icon: TriangleAlert,
    iconClass: '',
    titleClass: '',
    buttonClass: ''
  },
  info: {
    icon: CircleAlert,
    iconClass: '',
    titleClass: '',
    buttonClass: ''
  }
};
