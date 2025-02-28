import { ObjectId } from "mongodb";
import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity()
export class MaintenanceRequest {
  @ObjectIdColumn()
  id?: ObjectId;

  @Column()
  propertyId?: ObjectId; 

  @Column()
  clientId?: ObjectId;

  @Column()
  ownerId?: ObjectId; 

  @Column()
  description?: string;

  @Column({ enum: ["pending", "in-progress", "resolved"] })
  status?: "pending" | "in-progress" | "resolved";

  @Column()
  reportedAt?: Date;
}