import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Course } from 'src/course/models/course.model';

interface VideoAttributes {
  file_name: string;
  video_number: number;
  description: string;
  course_id: number;
}

@Table({ tableName: 'video' })
export class Video extends Model<Video, VideoAttributes> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  file_name: string;

  @Column({
    type: DataType.INTEGER,
  })
  video_number: number;

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @ForeignKey(() => Course)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  course_id: number;
}
