import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { User } from 'lucide-react';
import { ALLOWED_TYPES, MAX_FILE_SIZE_MB } from '~/constants';
import { cn } from '~/utils';

type Props = {
  value?: string | null;
  size?: number;
  accept?: string[];
  className?: string;
  onChange?: (file: File | null) => void;
  disabled?: boolean;
};

function AvatarUpload({
  value,
  size = MAX_FILE_SIZE_MB,
  accept = ALLOWED_TYPES,
  onChange,
  className,
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

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div className='relative'>
        <div
          className={cn(
            'group/avatar relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border border-dashed transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/20',
            preview && 'border-solid'
          )}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => !disabled && inputRef.current?.click()}
        >
          {preview ? (
            <img
              src={preview}
              alt='Avatar'
              className='size-full object-cover'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center'>
              <User className='size-6 text-muted-foreground' />
            </div>
          )}
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

export default AvatarUpload;
