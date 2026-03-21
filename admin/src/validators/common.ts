import z from 'zod';
import { LANGUAGES, GROUPS, ROLES } from '~/constants';

export const RoleSchema = z.enum(ROLES.map(({ value }) => value));
export const LanguageSchema = z.enum(LANGUAGES.map(({ value }) => value));
export const GroupSchema = z.enum(GROUPS.map(({ value }) => value));
