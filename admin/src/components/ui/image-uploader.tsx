import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';
import { ALLOWED_TYPES, MAX_FILE_SIZE_MB } from '~/constants';
import { Button } from '~/components/ui/button';
import { cn } from '~/utils';

type Props = {
  value?: string | null;
  size?: number;
  accept?: string[];
  onChange?: (file: File | null) => void;
  disabled?: boolean;
};

export function ImageUploader({
  value,
  size = MAX_FILE_SIZE_MB,
  accept = ALLOWED_TYPES,
  onChange,
  disabled
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    setPreview(value ?? null);
  }, [value]);

  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileSelect = useCallback(
    (file: File) => {
      if (!accept.includes(file.type)) {
        toast.warning(`Chỉ cho phép: ${accept.join(', ')}`);
        return;
      }

      if (file.size > size * 1024 * 1024) {
        toast.warning(`Kích thước file phải nhỏ hơn ${size}MB`);
        return;
      }

      onChange?.(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    },
    [accept, size, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleRemove = useCallback(() => {
    onChange?.(null);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [onChange]);

  if (preview) {
    return (
      <div className='relative w-full max-w-sm mx-auto group'>
        <div className='relative w-full border border-border rounded-lg shadow-sm select-none overflow-hidden'>
          <img
            src={preview}
            alt='Image preview'
            className='size-full object-cover'
          />
        </div>

        {!disabled && (
          <Button
            type='button'
            size='icon-sm'
            className={cn(
              'absolute top-2 right-2 size-6 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer'
            )}
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className='shrink-0' />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative w-full max-w-sm mx-auto rounded-lg border-2 border-dashed cursor-pointer transition-colors p-8',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/50 hover:border-primary hover:bg-primary/5',
        disabled && 'cursor-not-allowed opacity-50'
      )}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <div className='flex flex-col items-center justify-center gap-3'>
        <div className='rounded-lg bg-primary/10 p-3'>
          <Upload className='size-6 text-primary' />
        </div>
        <div className='text-center'>
          <p className='font-semibold text-foreground'>Nhấn hoặc kéo ảnh vào</p>
          <p className='text-xs text-muted-foreground mt-1'>
            JPG, PNG, WebP tối đa {size}MB
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type='file'
        accept='image/*'
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
        disabled={disabled}
        className='hidden'
        hidden
        aria-hidden='true'
      />
    </div>
  );
}
