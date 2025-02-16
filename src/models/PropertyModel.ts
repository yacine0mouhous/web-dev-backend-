import { ObjectId } from "mongodb";
import { Entity, ObjectIdColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Property {
  @ObjectIdColumn()
  _id!: object;

  @Column()
  ownerId!: ObjectId;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  location!: string;

  @Column("double")
  price!: number;

  @Column({ default: "available" })
  status!: "available" | "rented" | "sold";

  @CreateDateColumn()
  createdAt!: Date;
}
