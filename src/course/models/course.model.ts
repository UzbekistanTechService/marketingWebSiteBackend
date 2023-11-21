import { Column, DataType, Model, Table } from "sequelize-typescript";

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
}