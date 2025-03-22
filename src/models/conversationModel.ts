import { ObjectId } from "mongodb";
import { Entity, ObjectIdColumn,  Column, CreateDateColumn } from "typeorm";

@Entity("conversations")
export class Conversation {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  participants!: ObjectId[]; // Array of user IDs

  @Column()
  messages!: {
    senderId: ObjectId;
    content: ObjectId;
    createdAt: Date;
  }[];

  @CreateDateColumn()
  createdAt!: Date;
}
