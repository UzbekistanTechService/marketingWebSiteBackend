import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Course } from './models/course.model';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course) private courseRepository: typeof Course) {}

  async getAll() {
    try {
      const courses = await this.courseRepository.findAll({
        include: { all: true },
      });
      return courses;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: number) {
    try {
      const course = await this.courseRepository.findByPk(id, {
        include: { all: true },
      });
      if (!course) {
        return { message: 'Course not found!' };
      }
      return course;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async pagination(page_limit: string) {
    try {
      const page = Number(page_limit.split('-')[0]);
      const limit = Number(page_limit.split('-')[1]);
      const offset = (page - 1) * limit;
      const courses = await this.courseRepository.findAll({
        include: { all: true },
        offset,
        limit,
      });
      const total_count = await this.courseRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        status: 200,
        data: {
          records: courses,
          pagination: {
            currentPage: page,
            total_pages,
            total_count,
          },
        },
      };
      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
