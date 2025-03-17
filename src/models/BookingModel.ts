import { ObjectId } from "mongodb";
import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity()
export class Booking {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  propertyId!: ObjectId; 

  @Column()
  clientId!: ObjectId; 

  @Column()
  checkInDate!: Date;

  @Column()
  checkOutDate!: Date;

  @Column({ enum: ["pending", "confirmed", "canceled"] })
  status!: "pending" | "confirmed" | "canceled";

  @Column()
  totalAmount!: number;

  @Column({ default: () => new Date() }) 
  bookedAt!: Date;
}