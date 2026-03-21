import { type FastifyReply, type FastifyRequest } from 'fastify';
import { Prisma } from '@prisma/client';
import z from 'zod';
import { prisma } from '~/config';
import { formData, toStringArray, cloudinary } from '~/utils';

const ImageSchema = z.array(z.string().nullable()).optional();

const settingController = {
  // GET /api/settings/ads-image
  getAdsImage: async (request: FastifyRequest, reply: FastifyReply) => {
    const entity = await prisma.setting.findUnique({
      where: { key: 'ads-image' }
    });
    return reply.json(200, 'OK', entity);
  },

  // GET /api/settings/zalo
  getZalo: async (request: FastifyRequest, reply: FastifyReply) => {
    const entity = await prisma.setting.findUnique({
      where: { key: 'zalo' }
    });
    return reply.json(200, 'OK', entity);
  },

  // GET /api/settings/address-image
  getAddressImage: async (request: FastifyRequest, reply: FastifyReply) => {
    const entity = await prisma.setting.findUnique({
      where: { key: 'address-image' }
    });
    return reply.json(200, 'OK', entity);
  },

  // GET /api/settings/about-page
  getAboutPage: async (request: FastifyRequest, reply: FastifyReply) => {
    const entity = await prisma.setting.findUnique({
      where: { key: 'about-page' }
    });
    return reply.json(200, 'OK', entity);
  },

  // PUT /api/settings/ads-image
  updateAdsImage: async (request: FastifyRequest, reply: FastifyReply) => {
    let img: string | undefined = undefined;
    try {
      const key = 'ads-image';
      const entity = await prisma.setting.findUnique({
        where: { key },
        select: { value: true }
      });

      const data = await request.file().catch(() => null);

      if (data) {
        const buffer = await data.toBuffer();

        img = await cloudinary.upload({
          filename: data.filename,
          buffer
        });
      }

      const ads = await prisma.setting.upsert({
        where: { key },
        create: { key, value: img },
        update: { value: img === undefined ? Prisma.JsonNull : img }
      });

      if (entity?.value) {
        cloudinary.cleanup(entity.value as string);
      }

      return reply.json(200, 'OK', ads);
    } catch (error) {
      cloudinary.cleanup(img);
      throw error;
    } finally {
      await request.cleanRequestFiles();
    }
  },

  // PUT /api/settings/zalo
  updateZalo: async (request: FastifyRequest, reply: FastifyReply) => {
    let qr: string | undefined = undefined;
    let phone: string | undefined;

    try {
      const key = 'zalo';

      const entity = await prisma.setting.findUnique({
        where: { key },
        select: { value: true }
      });

      const parts = request.parts();

      for await (const part of parts) {
        if (part.type === 'file' && part.fieldname === 'file') {
          const buffer = await part.toBuffer();
          qr = await cloudinary.upload({
            filename: part.filename,
            buffer
          });
        }

        if (part.type === 'field' && part.fieldname === 'phone') {
          phone = String(part.value);
        }
      }

      const old = (entity?.value as any) ?? {};

      const value = {
        qr: qr ?? old.qr,
        phone: phone ?? old.phone
      };

      const zalo = await prisma.setting.upsert({
        where: { key },
        create: { key, value },
        update: { value }
      });

      if (qr) cloudinary.cleanup(old.qr);
      return reply.json(200, 'OK', zalo);
    } catch (error) {
      cloudinary.cleanup(qr);
      throw error;
    } finally {
      await request.cleanRequestFiles();
    }
  },

  // PUT /api/settings/address-image
  updateAddressImage: async (request: FastifyRequest, reply: FastifyReply) => {
    let img: string | undefined = undefined;
    try {
      const key = 'address-image';
      const entity = await prisma.setting.findUnique({
        where: { key },
        select: { value: true }
      });

      const data = await request.file().catch(() => null);

      if (data) {
        const buffer = await data.toBuffer();

        img = await cloudinary.upload({
          filename: data.filename,
          buffer
        });
      }

      const addr = await prisma.setting.upsert({
        where: { key },
        create: { key, value: img },
        update: { value: img === undefined ? Prisma.JsonNull : img }
      });

      if (entity?.value) {
        cloudinary.cleanup(entity.value as string);
      }

      return reply.json(200, 'OK', addr);
    } catch (error) {
      cloudinary.cleanup(img);
      throw error;
    } finally {
      await request.cleanRequestFiles();
    }
  },

  // PUT /api/settings/about-page
  updateAboutPage: async (request: FastifyRequest, reply: FastifyReply) => {
    let uploadedImages: string[] | undefined = undefined;
    try {
      const key = 'about-page';
      const entity = await prisma.setting.findUnique({
        where: { key },
        select: { value: true }
      });

      const { data, files } = await formData(request, ImageSchema);

      if (entity) {
        const imagesInDB = toStringArray(entity.value);
        const imagesToDelete = imagesInDB.filter(
          (img) => !data?.filter(Boolean).includes(img)
        );

        uploadedImages = files?.length ? await cloudinary.upload(files) : [];

        const imgs: string[] = [];
        let uploaded = [...uploadedImages];

        for (const img of data || []) {
          if (img) {
            imgs.push(img);
          } else if (uploaded.length) {
            imgs.push(uploaded.shift()!);
          }
        }

        for (const name of uploaded) {
          imgs.push(name);
        }

        await prisma.setting.update({
          where: { key },
          data: { value: imgs }
        });

        if (imagesToDelete.length) {
          cloudinary.cleanup(imagesToDelete);
        }

        const page = await prisma.setting.findUnique({ where: { key } });

        return reply.json(200, 'OK', page);
      } else {
        uploadedImages = await cloudinary.upload(files);
        const page = await prisma.setting.create({
          data: { key, value: uploadedImages }
        });
        return reply.json(200, 'OK', page);
      }
    } catch (error) {
      cloudinary.cleanup(uploadedImages);
      throw error;
    } finally {
      await request.cleanRequestFiles();
    }
  }
};

export default settingController;
