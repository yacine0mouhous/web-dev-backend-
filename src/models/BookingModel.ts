import { Entity, ObjectIdColumn, ObjectId, Column } from "typeorm";

@Entity()
export class Booking {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  userId!: ObjectId; // User who made the booking

  @Column()
  propertyId!: ObjectId; // Property being booked

  @Column()
  bookingDate!: Date;

  @Column()
  startDate!: Date;

  @Column()
  endDate!: Date;

  @Column()
  totalPrice!: number;

  @Column({ default: "pending" })
  status!:  "pending" | "confirmed" |  "canceled"
}
