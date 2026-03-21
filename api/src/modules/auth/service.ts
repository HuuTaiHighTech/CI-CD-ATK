import { type Prisma } from '@prisma/client';
import { prisma } from '~/config';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException
} from '~/exceptions';
import { bcrypt } from '~/utils';
import type { User } from '~/types';
import { type ProfileBody } from '~/modules/auth/schema';

class AuthService {
  private model;

  constructor() {
    this.model = prisma.user;
  }

  authenticate = async (username: string, password: string): Promise<User> => {
    const user = await this.model.findFirst({
      where: { username, active: true, role: { not: 'USER' } },
      select: {
        id: true,
        name: true,
        username: true,
        password: true,
        role: true
      }
    });

    if (!user) {
      await bcrypt.compare(
        password,
        '$2a$10$dummy.hash.to.prevent.timing.attack'
      );
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const { password: _, ...safeUser } = user;
    return safeUser;
  };

  update = async (id: string, data: ProfileBody): Promise<User> => {
    const user = await this.model.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        password: true,
        role: true
      }
    });
    if (!user) throw new NotFoundException();

    const input: Prisma.UserUpdateInput = {};

    if (data.username && data.username !== user.username) {
      const taken = await prisma.user.count({
        where: {
          username: data.username,
          NOT: { id }
        }
      });

      if (taken > 0) {
        throw new BadRequestException('Tên đăng nhập đã tồn tại');
      }

      input.username = data.username;
    }

    if (data.name) {
      input.name = data.name.trim();
    }

    if (data.newPassword && data.currentPassword) {
      const isMatch = await bcrypt.compare(data.currentPassword, user.password);
      if (!isMatch) throw new BadRequestException('Mật khẩu cũ không đúng');
      input.password = await bcrypt.hash(data.newPassword);
    }

    if (Object.keys(input).length === 0) {
      const { password, ...rest } = user;
      return rest;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: input,
      select: { id: true, username: true, name: true, role: true }
    });
    return updated;
  };
}

export default new AuthService();
