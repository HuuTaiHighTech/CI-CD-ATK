import cn from '~/utils/cn';
import generatePassword from '~/utils/generate-password';
import normalize from '~/utils/normalize';
import api from '~/utils/api';

export * from '~/utils/error';
export * from '~/utils/build-tree';
export * from '~/utils/date';
export * from '~/utils/format';

export const limitOptions = Array.from({ length: 20 }, (_, i) => (i + 1) * 5);

export const getRowNumber = (index: number, current: number, limit: number) => {
  return (current - 1) * limit + index + 1;
};

export { cn, generatePassword, normalize, api };
