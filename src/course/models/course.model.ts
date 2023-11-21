import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Video } from 'src/video/models/video.model';

interface CourseAttributes {
  name: string;
  price: number;
  description: string;
}

@Table({ tableName: 'course' })
export class Course extends Model<Course, CourseAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @HasMany(() => Video, {
    onDelete: 'CASCADE',
    hooks: true
  })
  videos: Video[];
}
