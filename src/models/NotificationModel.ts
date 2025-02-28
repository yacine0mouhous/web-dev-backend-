import { ObjectId } from "mongodb";
import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity()
export class Notification {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  userId!: ObjectId; 

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({ enum: ["pending", "warning", "success", "info"] })
  type!: "pending" | "warning" | "success" | "info";

  @Column({ enum: ["unread", "read"] })
  status!: "unread" | "read";

  @Column()
  createdAt!: Date;
}