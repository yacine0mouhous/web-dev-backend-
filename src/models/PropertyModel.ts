import { ObjectId } from "mongodb";
import { Entity, ObjectIdColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Property {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  name?: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  location?: string;

  @Column()
  ownerId!: ObjectId;

  @Column("array", { default: [] })
  images?: string[];

  @Column()
  status?: "available" | "rented" | "sold" | "inactive";

  @Column()
  type?: "real_estate" | "rented_real_estate" | "hotel";

  @Column()
  category?: string;

  @Column({ nullable: true })
  sellPrice?: number;

  @Column({ nullable: true })
  rentPrice?: number;

  @Column({ nullable: true })
  leaseTerm?: "short-term" | "long-term";

  @Column({ nullable: true })
  roomCount?: number;

  @CreateDateColumn()
  createdAt?: Date;

  @Column({ nullable: true, type: "date" })
  updatedAt?: Date;

  @Column("array", { default: [] })
  transactionIds?: ObjectId[];

  @Column("array", { default: [] })
  maintenanceRequestIds?: ObjectId[];

  @Column("array", { default: [] })
  leaseIds?: ObjectId[];

  @Column("array", { default: [] })
  bookingIds?: ObjectId[];
    static findOne: any;
}
