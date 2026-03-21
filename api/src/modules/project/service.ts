import type { Language, Prisma, Project } from '@prisma/client';
import { prisma } from '~/config';
import { BadRequestException, NotFoundException } from '~/exceptions';
import { cloudinary, validate } from '~/utils';
import type { FileBuffer, Paged, ProjectDto } from '~/types';
import { ProjectQuery, type ProjectBody } from '~/modules/project/schema';

class ProjectService {
  private model;

  constructor() {
    this.model = prisma.project;
  }

  private where = (
    query: ProjectQuery,
    draft: boolean = false
  ): Prisma.ProjectWhereInput => {
    const { search, visible } = query;

    const conditions: Prisma.ProjectWhereInput[] = [];

    if (!draft) {
      conditions.push({ visible: true });
    } else {
      if (visible !== undefined) {
        conditions.push({ visible });
      }
    }

    const trimmed = search?.trim();
    if (trimmed) {
      const filter = { contains: trimmed, mode: 'insensitive' } as const;
      conditions.push({
        i18n: {
          some: { name: filter }
        }
      });
    }

    return conditions.length > 0 ? { AND: conditions } : {};
  };

  paginate = async (
    query: ProjectQuery,
    lang: Language,
    draft: boolean = false
  ): Promise<Paged<ProjectDto>> => {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const where = this.where(query, draft);

    const [entities, total] = await Promise.all([
      this.model.findMany({
        where,
        include: {
          i18n: {
            where: { lang },
            select: { name: true, details: true }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.model.count({ where })
    ]);

    const items = entities.map((entity) => {
      const i18n = entity?.i18n[0];
      return {
        id: entity.id,
        thumbnail: entity.thumbnail,
        name: i18n?.name || '',
        details: i18n?.details,
        ...(draft && {
          visible: entity.visible,
          updatedAt: entity.updatedAt
        }),
        createdAt: entity.createdAt
      };
    });
    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  };

  getById = async (id: string): Promise<Project> => {
    const entity = await this.model.findUnique({
      where: { id },
      include: { i18n: { orderBy: { lang: 'asc' } } }
    });
    if (!entity) throw new NotFoundException();
    return entity;
  };

  create = async (data: ProjectBody, file?: FileBuffer): Promise<Project> => {
    let thumbnail: string | undefined;
    try {
      const { i18n, visible = false } = data;
      const result = await prisma.$transaction(async (tx) => {
        validate.i18n(i18n);

        if (!file) throw new BadRequestException('Hãy tải lên hình ảnh dự án');

        thumbnail = await cloudinary.upload(file);

        const entity = await tx.project.create({
          data: {
            thumbnail,
            visible,
            i18n: { create: i18n }
          }
        });

        return entity;
      });
      return result;
    } catch (error) {
      cloudinary.cleanup(thumbnail);
      throw error;
    }
  };

  update = async (
    id: string,
    data: ProjectBody,
    file?: FileBuffer
  ): Promise<Project> => {
    let thumbnail: string | undefined;

    try {
      const { i18n = [], visible } = data;
      const result = await prisma.$transaction(async (tx) => {
        const entity = await tx.project.findUnique({
          where: { id },
          select: { thumbnail: true }
        });
        if (!entity) throw new NotFoundException();

        const input: Prisma.ProjectUpdateInput = {};

        if (file) {
          thumbnail = await cloudinary.upload(file);
          input.thumbnail = thumbnail;
        }

        if (visible !== undefined) input.visible = visible;

        await tx.project.update({ where: { id }, data: input });

        for (const item of i18n) {
          await tx.projectI18n.upsert({
            where: {
              projectId_lang: {
                projectId: id,
                lang: item.lang
              }
            },
            update: item,
            create: { projectId: id, ...item }
          });
        }

        if (thumbnail) {
          cloudinary.cleanup(entity.thumbnail);
        }

        return await tx.project.findUnique({
          where: { id },
          include: { i18n: { orderBy: { lang: 'asc' } } }
        });
      });

      return result!;
    } catch (error) {
      cloudinary.cleanup(thumbnail);
      throw error;
    }
  };

  delete = async (id: string): Promise<boolean> => {
    try {
      const entity = await this.model.findUnique({
        where: { id },
        select: { thumbnail: true }
      });

      if (!entity) throw new NotFoundException();

      await this.model.delete({ where: { id } });

      cloudinary.cleanup(entity.thumbnail);

      return true;
    } catch (error) {
      throw error;
    }
  };
}

export default new ProjectService();
