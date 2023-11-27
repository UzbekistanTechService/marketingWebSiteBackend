import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Course } from 'src/course/models/course.model';
import { User } from 'src/user/models/user.model';

interface CartAttributes {
  id: number;
  user_id: number;
  course_id: number;
}

@Table({ tableName: 'cart' })
export class Cart extends Model<Cart, CartAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  user_id: number;
  
  @ForeignKey(() => Course)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  course_id: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Course)
  course: Course;
}
