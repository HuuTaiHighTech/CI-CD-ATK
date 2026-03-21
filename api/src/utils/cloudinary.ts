import { v2 } from 'cloudinary';
import type { FileBuffer } from '~/types';

class CloudinaryService {
  private extractPublicId(url: string): string | null {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    return match ? match[1] : null;
  }

  private async retry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
    try {
      return await fn();
    } catch (err) {
      if (retries === 0) throw err;
      return this.retry(fn, retries - 1);
    }
  }

  uploadSingle(file: FileBuffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = v2.uploader.upload_stream(
        {
          folder: 'uploads',
          resource_type: "image",
          allowed_formats: ["jpg", "jpeg", "png", "webp"],
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload failed: empty result'));

          resolve(result.secure_url);
        }
      );

      stream.end(file.buffer);
    });
  }

  upload(file: FileBuffer): Promise<string>;
  upload(files: FileBuffer[]): Promise<string[]>;
  async upload(param: FileBuffer | FileBuffer[]): Promise<string | string[]> {
    const files = Array.isArray(param) ? param : [param];
    const imageUrls = await Promise.all(
      files.map((file) => this.retry(() => this.uploadSingle(file)))
    );
    return Array.isArray(param) ? imageUrls : imageUrls[0];
  }

  async cleanup(param?: string | string[] | null): Promise<void> {
    if (!param) return;
    const assetUrls = Array.isArray(param) ? param : [param];
    await Promise.allSettled(
      assetUrls.map(async (url) => {
        const publicId = this.extractPublicId(url);
        if (!publicId) return;
        await this.retry(() =>
          v2.uploader.destroy(publicId, { invalidate: true })
        );
      })
    );
  }
}

const cloudinary = new CloudinaryService();

export default cloudinary;
