import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface PollAttributes {
  id: string;
  phone_number: string;
  name: string;
  service: PollServiceType;
}

export enum PollServiceType {
  smm = 'smm',
}

@Table({ tableName: 'poll' })
export class Poll extends Model<Poll, PollAttributes> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone_number: string;

  @Column({
    type: DataType.ENUM('smm'),
    allowNull: false,
  })
  service: PollServiceType;
}
