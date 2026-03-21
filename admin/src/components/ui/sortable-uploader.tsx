import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { ImagePlus, X } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '~/components/ui/button';
import { ALLOWED_TYPES, MAX_FILE_SIZE_MB } from '~/constants';
import { cn } from '~/utils';

type ImageType = string | File;

type Aspect = `${number}/${number}`;

const getStableId = (() => {
  const fileIdMap = new WeakMap<File, string>();
  let counter = 0;

  return (image: ImageType): string => {
    if (typeof image === 'string') {
      return `url-${image}`;
    }

    if (!fileIdMap.has(image)) {
      fileIdMap.set(image, `file-${counter++}-${image.name}-${image.size}`);
    }

    return fileIdMap.get(image)!;
  };
})();

interface ImageItemData {
  id: string;
  preview: string;
  original: ImageType;
}

interface SortableImageProps {
  item: ImageItemData;
  index: number;
  total: number;
  aspect: Aspect;
  onRemove: (id: string) => void;
  isLoading?: boolean;
}

const SortableImage = React.memo(function SortableImage({
  item,
  index,
  aspect,
  onRemove,
  isLoading
}: SortableImageProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: item.id,
    disabled: isLoading
  });

  const style: React.CSSProperties = {
    ['--aspect' as never]: aspect,
    transform: CSS.Transform.toString(transform),
    transition: transition,
    zIndex: isDragging ? 1 : undefined
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='group relative aspect-(--aspect) rounded-lg bg-muted select-none overflow-hidden'
    >
      <div
        className={cn(
          'absolute inset-0',
          isLoading
            ? 'cursor-not-allowed'
            : 'cursor-grab active:cursor-grabbing'
        )}
        {...attributes}
        {...listeners}
      >
        <img
          src={item.preview}
          alt={`Upload ${index + 1}`}
          className='size-full object-cover pointer-events-none'
        />
      </div>

      {!isDragging && !isLoading && (
        <Button
          type='button'
          size='icon-sm'
          className='absolute top-2 right-2 size-6 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer'
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.id);
          }}
          disabled={isLoading}
        >
          <X className='shrink-0' />
        </Button>
      )}
    </div>
  );
});

interface Props {
  value: ImageType[];
  aspect?: Aspect;
  accept?: string[];
  size?: number;
  max?: number;
  onChange: (images: ImageType[]) => void;
  isLoading?: boolean;
}

function SortableUploader({
  value,
  aspect = '1/1',
  accept = ALLOWED_TYPES,
  max = 10,
  size = MAX_FILE_SIZE_MB,
  isLoading,
  onChange
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const blobUrlCacheRef = useRef<Map<File, string>>(new Map());

  const items = useMemo<ImageItemData[]>(() => {
    return value.map((image) => {
      const id = getStableId(image);

      let preview: string;

      if (image instanceof File) {
        if (blobUrlCacheRef.current.has(image)) {
          preview = blobUrlCacheRef.current.get(image)!;
        } else {
          preview = URL.createObjectURL(image);
          blobUrlCacheRef.current.set(image, preview);
        }
      } else {
        preview = image;
      }

      return { id, preview, original: image };
    });
  }, [value]);

  useEffect(() => {
    const currentFiles = new Set(
      value.filter((img): img is File => img instanceof File)
    );

    blobUrlCacheRef.current.forEach((blobUrl, file) => {
      if (!currentFiles.has(file)) {
        URL.revokeObjectURL(blobUrl);
        blobUrlCacheRef.current.delete(file);
      }
    });
  }, [value]);

  useEffect(() => {
    const cache = blobUrlCacheRef.current;
    return () => {
      cache.forEach((blobUrl) => URL.revokeObjectURL(blobUrl));
      cache.clear();
    };
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const validateFile = useCallback(
    (file: File): { valid: boolean; error?: string } => {
      if (!accept.includes(file.type)) {
        return {
          valid: false,
          error: `"${file.name}" có định dạng không hợp lệ.`
        };
      }

      if (file.size > size * 1024 * 1024) {
        return {
          valid: false,
          error: `"${file.name}" vượt quá giới hạn ${size}MB.`
        };
      }

      return { valid: true };
    },
    [accept, size]
  );

  const handleFileSelect = useCallback(
    (files: File[]) => {
      if (isLoading) return;

      const validFiles: File[] = [];

      for (const file of files) {
        const { valid, error } = validateFile(file);

        if (!valid) {
          toast.error(error);
          continue;
        }

        validFiles.push(file);
      }

      if (validFiles.length === 0) return;

      const remaining = max - value.length;
      const filesToAdd = validFiles.slice(0, remaining);

      if (validFiles.length > remaining) {
        toast.warning(`Chỉ có thể thêm ${max} ảnh.`);
      }

      onChange([...value, ...filesToAdd]);
    },
    [value, validateFile, max, onChange, isLoading]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        handleFileSelect(Array.from(files));
      }
      e.target.value = '';
    },
    [handleFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (isLoading) return;

      const files = e.dataTransfer?.files;
      if (files) {
        handleFileSelect(Array.from(files));
      }
    },
    [handleFileSelect, isLoading]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleRemove = useCallback(
    (id: string) => {
      if (isLoading) return;

      const newValue = value.filter((_, index) => {
        return getStableId(value[index]) !== id;
      });

      onChange(newValue);
    },
    [value, onChange, isLoading]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return;

      const newValue = arrayMove(value, oldIndex, newIndex);
      onChange(newValue);
    },
    [items, value, onChange]
  );

  return (
    <div className='space-y-4'>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={rectSortingStrategy}
        >
          <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4'>
            {items.map((item, index) => (
              <SortableImage
                key={item.id}
                item={item}
                index={index}
                total={items.length}
                aspect={aspect}
                onRemove={handleRemove}
                isLoading={isLoading}
              />
            ))}

            {value.length < max && (
              <button
                type='button'
                onClick={() => inputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                style={{ '--aspect': aspect } as React.CSSProperties}
                className={cn(
                  'w-full flex items-center justify-center aspect-(--aspect) rounded-lg',
                  'border-2 border-dashed border-muted-foreground/25 bg-muted/50',
                  'cursor-pointer',
                  'transition-colors hover:border-muted-foreground/50 hover:bg-muted'
                )}
                disabled={isLoading}
              >
                <ImagePlus
                  className='size-7 text-muted-foreground'
                  strokeWidth={1.5}
                />
              </button>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <input
        ref={inputRef}
        type='file'
        accept={accept.join(',')}
        multiple
        hidden
        aria-hidden='true'
        aria-label='Upload images'
        onChange={handleFileChange}
        disabled={isLoading}
      />

      <p className='text-xs text-muted-foreground'>
        <span className='font-medium'>
          {value.length} / {max} ảnh
        </span>
        {' • '}
        Định dạng: {accept.map((t) => t.split('/')[1].toUpperCase()).join(', ')}
        {' • '}
        Tối đa {size}MB/ảnh
      </p>
    </div>
  );
}

export default SortableUploader;
