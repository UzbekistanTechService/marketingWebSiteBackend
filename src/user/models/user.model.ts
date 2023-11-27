import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Cart } from 'src/cart/models/cart.model';
import { Order } from 'src/order/models/order.model';

interface UserAttributes {
  id: number;
  email: string;
  hashed_password: string;
  full_name: string;
  provider: ProviderType;
}

export enum ProviderType {
  local = 'local',
  google = 'google',
}

@Table({ tableName: 'user' })
export class User extends Model<User, UserAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  hashed_password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  full_name: string;

  @Column({
    type: DataType.ENUM('local', 'google'),
  })
  provider: ProviderType;

  @HasMany(()=> Cart, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  carts: Cart[];

  @HasMany(()=> Order, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  orders: Order;
}
