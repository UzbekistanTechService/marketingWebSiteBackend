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

  const file_name = v4() + '.jpg';
  const file_path = resolve(__dirname, '..', 'static');
  if (!existsSync(file_path)) {
    mkdirSync(file_path, { recursive: true });
  }

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
        features: [uploadFeature({
          provider: { local: { bucket: file_path } },
          properties: {
            key: file_name,
            mimeType: 'jpg'
          },
          uploadPath: (record, filename) => file_path,
        })],
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
