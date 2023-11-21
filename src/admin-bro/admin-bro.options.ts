import { INestApplication } from '@nestjs/common';
import { Database, Resource } from '@admin-bro/sequelize';
import AdminBro from 'admin-bro';
import * as AdminBroExpress from 'admin-bro-expressjs';
import { User } from '../user/models/user.model';
import { Course } from '../course/models/course.model';
import { Video } from '../video/models/video.model';

const ADMIN = {
  email: 'uts@gmail.com',
  password: 'uts2023',
};

export async function setupAdminPanel(app: INestApplication): Promise<void> {
  AdminBro.registerAdapter({ Database, Resource });

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
