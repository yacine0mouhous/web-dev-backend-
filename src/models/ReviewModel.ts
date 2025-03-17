import { ObjectId } from "mongodb";
import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity()
export class Review {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  propertyId!: ObjectId;

  @Column()
  clientId?: ObjectId;

  @Column()
  rating?: number;

  @Column()
  comment?: string;

  @Column({ default: new Date() })
  createdAt?: Date;
}
