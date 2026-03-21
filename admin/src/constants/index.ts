export * from '~/constants/routes';
export * from '~/constants/sidebar';

export const MAX_FILE_SIZE_MB = 10;
export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const ROLES = [
  { value: 'USER', label: 'Người dùng' },
  { value: 'EDITOR', label: 'Biên tập viên' },
  { value: 'ADMIN', label: 'Quản trị viên' }
] as const;

export const ROLE_MAP = Object.fromEntries(
  ROLES.map((r) => [r.value, r.label])
);

export const LANGUAGES = [
  { value: 'VI', label: 'Tiếng Việt' },
  { value: 'EN', label: 'Tiếng Anh' }
] as const;

export const LANGUAGE_MAP = Object.fromEntries(
  LANGUAGES.map((l) => [l.value, l.label])
);

export const GROUPS = [
  { value: 'ALWAYS_TAKE_CARE', label: 'Always Take Care' },
  { value: 'TRUST_IN_MIND', label: 'Trust In Mind' },
  { value: 'KEEP_PROMISE', label: 'Keep Promise' },
  { value: 'COMPANY', label: 'Hoạt động công ty' },
  { value: 'COMMUNITY', label: 'Hoạt động cộng đồng' }
] as const;

export const GROUP_MAP = Object.fromEntries(
  GROUPS.map((g) => [g.value, g.label])
);
