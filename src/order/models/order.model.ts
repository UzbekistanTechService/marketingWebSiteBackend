import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Course } from 'src/course/models/course.model';
import { User } from 'src/user/models/user.model';

interface OrderAttributes {
  user_id: number;
  course_id: number;
}

@Table({ tableName: 'order' })
export class Order extends Model<Order, OrderAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  user_id: number;

  @ForeignKey(() => Course)
  @Column({
    type: DataType.INTEGER,
  })
  course_Id: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Course)
  course: Course;
}
