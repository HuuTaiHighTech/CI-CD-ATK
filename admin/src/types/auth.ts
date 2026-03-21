import type z from 'zod';
import type {
  RoleSchema,
  UpdatePasswordSchema,
  ProfileSchema
} from '~/validators';
import type { UserSchema } from '~/validators';

export type Role = z.infer<typeof RoleSchema>;

export type UserForm = z.infer<typeof UserSchema>;
export type ProfileForm = z.infer<typeof ProfileSchema>;
export type UpdatePassword = z.infer<typeof UpdatePasswordSchema>;

export type User = {
  id: string;
  name: string;
  username: string;
  role: Role;
};

export type UserDto = User & {
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export interface Credentials {
  username: string;
  password: string;
}
