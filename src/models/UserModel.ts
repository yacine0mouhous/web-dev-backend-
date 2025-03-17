import { ObjectId } from "mongodb";
import { Entity, ObjectIdColumn, Column } from "typeorm";

@Entity()
export class User {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column({ nullable: true })
  fullName?: string;

  @Column({ unique: true })
  email?: string;

  @Column({ select: false })
  password?: string;

  @Column({ default: false })
  isVerified?: boolean;

  @Column()
  role?: "client" | "admin" | "owner";

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  googleId?: string;

  @Column({ nullable: true, type: "date" })
  createdAt?: Date;

  @Column({ nullable: true, type: "date" })
  updatedAt?: Date;

  @Column("array", { default: [] })
  transactionIdsAsPayer?: ObjectId[];

  @Column("array", { default: [] })
  transactionIdsAsReceiver?: ObjectId[];

  @Column("array", { default: [] })
  propertyIds?: ObjectId[];

  @Column("array", { default: [] })
  notificationIds?: ObjectId[];

  @Column("array", { default: [] })
  maintenanceRequestIds?: ObjectId[];

  @Column("array", { default: [] })
  leaseIds?: ObjectId[];

  @Column("array", { default: [] })
  bookingIds?: ObjectId[];
}
