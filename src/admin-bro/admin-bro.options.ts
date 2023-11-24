import { INestApplication } from '@nestjs/common';
import { Database, Resource } from '@admin-bro/sequelize';
import AdminBro from 'admin-bro';
import * as AdminBroExpress from 'admin-bro-expressjs';
import { User } from '../user/models/user.model';
import { Course } from '../course/models/course.model';
import { Video } from '../video/models/video.model';
import uploadFeature from '@admin-bro/upload';
import { resolve } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { v4 } from 'uuid';
import { LocalProvider } from './local.provider';
import { Poll } from 'src/poll/models/poll.model';

const ADMIN = {
  email: 'uts@gmail.com',
  password: 'uts2023',
};

export async function setupAdminPanel(app: INestApplication): Promise<void> {
  AdminBro.registerAdapter({ Database, Resource });

  
  const file_path = resolve(__dirname, '../..', 'files');
  if (!existsSync(file_path)) {
    mkdirSync(file_path, { recursive: true });
  }

  const localProvider = new LocalProvider(file_path, 'files');

  const adminBro = new AdminBro({
    resources: [
      {
        resource: User,
      },
      {
        resource: Course,
      },
      {
        resource: Poll,
      },
      {
        resource: Video,
        features: [
          uploadFeature({
            provider: localProvider,
            properties: {
              key: 'file_name',
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
