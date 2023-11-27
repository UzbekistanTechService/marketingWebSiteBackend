import { BaseProvider } from '@admin-bro/upload';
import { UploadedFile } from 'admin-bro';
import { promises, existsSync } from 'fs';
import { resolve, dirname } from 'path';
export class LocalProvider extends BaseProvider {
  assetPath: string;
  constructor(bucket: string, assetPath: string) {
    super(bucket);
    this.assetPath = assetPath;
  }

  async upload(file: UploadedFile, key: string): Promise<any> {
    const fullPath = resolve(this.assetPath, key);
    const dirPath = dirname(fullPath);
    if (!existsSync(dirPath)) {
      await promises.mkdir(dirPath, { recursive: true });
    }
    await promises.copyFile(file.path, fullPath);
    await promises.unlink(file.path);
    return key;
  }

  async delete(key: string): Promise<any> {
    const filePath = resolve(this.assetPath, key);

    if (existsSync(filePath)) {
      await promises.unlink(filePath);
      const dirPath = dirname(filePath);
      const otherFiles = await promises.readdir(dirPath);
      if (otherFiles && otherFiles.length == 0) {
        await promises.rmdir(dirPath);
      }
    }
  }

  path(bucket: string): Promise<string> | string {
    return '/' + bucket;
  }
}
