import { Entity, ObjectIdColumn, ObjectId, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Transaction {
  @ObjectIdColumn()
  id!: ObjectId;

  @ObjectIdColumn()
  userId!: ObjectId;

  @Column()
  amount!: number;

  @Column()
  currency!: string;

  @Column()
  status!: "pending" | "completed" | "failed";

  @CreateDateColumn()
  createdAt!: Date;
}
