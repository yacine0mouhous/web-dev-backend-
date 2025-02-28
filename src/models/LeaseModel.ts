import { Entity, ObjectIdColumn, ObjectId, Column } from "typeorm";

@Entity()
export class Lease {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column(() => ObjectId)
  propertyId!: ObjectId;

  @Column(() => ObjectId)
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