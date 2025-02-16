import { Entity, ObjectIdColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Property {
  @ObjectIdColumn()
  _id!: string;

  @Column()
  ownerId!: string;

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
