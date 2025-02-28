import { Entity, ObjectIdColumn, Column } from "typeorm";
import { ObjectId } from "mongodb";

@Entity()
export class Lease {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  propertyId!: ObjectId;

  @Column()
  clientId!: ObjectId; 

  @Column()
  startDate!: Date;

  @Column()
  endDate!: Date;

  @Column({ enum: ["active", "pending", "terminated"] })
  status!: "active" | "pending" | "terminated";

  @Column()
  rentAmount!: number;
}
