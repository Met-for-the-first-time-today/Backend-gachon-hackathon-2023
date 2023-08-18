import {
  Model,
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  PrimaryKey,
  Table,
  Default,
} from "sequelize-typescript";

@Table
export default class Script extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  index: number;

  @AllowNull(false)
  @Column(DataType.STRING(60))
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING(60))
  title: string;

  @Column(DataType.STRING())
  data: string;

  @AllowNull(false)
  @Default(1.0)
  @Column(DataType.FLOAT())
  speed: number;
}
