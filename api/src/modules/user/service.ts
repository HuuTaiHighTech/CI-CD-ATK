import { type Prisma } from '@prisma/client';
import { prisma } from '~/config';
import { BadRequestException, NotFoundException } from '~/exceptions';
import { type UserQuey, type UserBody } from '~/modules/user/schema';
import type { User } from '~/types';
import type { Paged } from '~/types';
import { bcrypt } from '~/utils';

class UserService {
   private model;

   constructor() {
      this.model = prisma.user;
   }

   private where = (query: UserQuey): Prisma.UserWhereInput => {
      const { search, role, active } = query;
      const conditions: Prisma.UserWhereInput[] = [];

      const trimmed = search?.trim();
      if (trimmed) {
         const filter = { contains: trimmed, mode: 'insensitive' } as const;
         conditions.push({
            OR: [{ username: filter }, { name: filter }]
         });
      }

      if (role !== undefined) {
         conditions.push({ role });
      }

      if (active !== undefined) {
         conditions.push({ active });
      }

      return conditions.length > 0 ? { AND: conditions } : {};
   };

   get = async (query: UserQuey): Promise<Paged<User>> => {
      const { page = 1, limit = 10 } = query;
      const where = this.where(query);
      const skip = (page - 1) * limit;
      const [users, total] = await prisma.$transaction([
         this.model.findMany({
            where,
            select: {
               id: true,
               username: true,
               name: true,
               role: true,
               active: true,
               createdAt: true,
               updatedAt: true
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' }
         }),
         this.model.count({ where })
      ]);

      return {
         items: users,
         pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
         }
      };
   };

   isUsernameTaken = async (username: string): Promise<boolean> => {
      const count = await this.model.count({
         where: { username }
      });
      return count > 0;
   };

   getById = async (id: string): Promise<User> => {
      const user = await this.model.findUnique({
         where: { id },
         select: {
            id: true,
            name: true,
            username: true,
            role: true,
            active: true
         }
      });
      if (!user) throw new NotFoundException();
      return user;
   };

   create = async (data: UserBody): Promise<User> => {
      const exists = await this.isUsernameTaken(data.username);
      if (exists) throw new BadRequestException('Tên đăng nhập đã tồn tại');
      const hashed = await bcrypt.hash(data.password);
      const user = await this.model.create({
         data: {
            name: data.name,
            username: data.username,
            password: hashed,
            role: data.role || 'USER',
            active: data.active ?? false
         },
         select: {
            id: true,
            username: true,
            name: true,
            role: true,
            active: true
         }
      });

      return user;
   };

   update = async (id: string, data: Partial<UserBody>): Promise<User> => {
      const { name, username, password, role, active } = data;

      const user = await this.model.findUnique({
         where: { id },
         select: {
            id: true,
            username: true,
            name: true,
            role: true,
            active: true
         }
      });
      if (!user) throw new NotFoundException('User not found');

      const input: Prisma.UserUpdateInput = {};

      if (name) input.name = name;

      if (username && username !== user.username) {
         const taken = await this.model.count({
            where: {
               username: data.username,
               NOT: { id }
            }
         });
         if (taken > 0) {
            throw new BadRequestException('Tên đăng nhập đã tồn tại');
         }
         input.username = username;
      }

      if (password) input.password = await bcrypt.hash(password);

      if (role) input.role = role;

      if (active !== undefined) input.active = active;

      if (Object.keys(input).length === 0) return user;

      const updated = await this.model.update({
         where: { id },
         data: input,
         select: {
            id: true,
            username: true,
            name: true,
            role: true,
            active: true
         }
      });

      return updated;
   };

   delete = async (id: string): Promise<void> => {
      const user = await this.model.findUnique({
         where: { id }
      });
      if (!user) throw new NotFoundException('Người dùng không tồn tại');
      await this.model.delete({ where: { id } });
   };
}

export default new UserService();
