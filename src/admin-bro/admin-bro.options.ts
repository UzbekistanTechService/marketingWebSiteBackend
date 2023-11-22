import { INestApplication } from '@nestjs/common';
import { Database, Resource } from '@admin-bro/sequelize';
import AdminBro from 'admin-bro';
import * as AdminBroExpress from 'admin-bro-expressjs';
import { User } from '../user/models/user.model';
import { Course } from '../course/models/course.model';
import { Video } from '../video/models/video.model';
import uploadFeature from '@admin-bro/upload';
import { join, resolve } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { v4 } from 'uuid';

const ADMIN = {
  email: 'uts@gmail.com',
  password: 'uts2023',
};

export async function setupAdminPanel(app: INestApplication): Promise<void> {
  AdminBro.registerAdapter({ Database, Resource });

  // const file_name = v4() + '.jpg';
  // const file_path = resolve(__dirname, '..', 'static');
  // if (!existsSync(file_path)) {
  //   mkdirSync(file_path, { recursive: true });
  // }
  // writeFileSync(join(file_path, file_name), file.buffer);

  const adminBro = new AdminBro({
    resources: [
      {
        resource: User,
      },
      {
        resource: Course,
      },
      {
        resource: Video,
        options: {
          listProperties: ['fileUrl', 'mimeType'],
        },
        features: [
          uploadFeature({
            provider: {
              aws: {
                bucket: 'images',
                region: 'us-east-1',
                accessKeyId: 'AKIA3HGEHPPYIAYEUL56',
                secretAccessKey: '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',
              },
            },
            properties: {
              key: 'file_path',
            },
          }),
        ],
      },
    ],
    rootPath: '/admin',
  });

  const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email: string, password: string) => {
      if (ADMIN.email === email && ADMIN.password === password) {
        return ADMIN;
      }
      return null;
    },
    cookieName: 'uts-name',
    cookiePassword: 'uts-key',
  });
  app.use(adminBro.options.rootPath, router);
}
