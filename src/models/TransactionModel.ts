import { Entity, ObjectIdColumn, Column, CreateDateColumn } from "typeorm";
import { ObjectId } from "mongodb";

@Entity()
export class Transaction {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  payerId!: ObjectId;

  @Column()
  receiverId!: ObjectId;

  @Column()
  propertyId!: ObjectId;

  @Column()
  amount!: number;

  @Column()
  currency!: string;

  @Column({ type: "enum", enum: ["rent", "deposit", "sale", "penalty"] })
  type!: "rent" | "deposit" | "sale" | "penalty";

  @Column()
  date!: Date;

  @Column({ type: "enum", enum: ["pending", "completed", "failed"] })
  status!: "pending" | "completed" | "failed";

  @Column({ type: "enum", enum: ["credit_card", "bank_transfer", "paypal"] })
  paymentMethod!: "credit_card" | "bank_transfer" | "paypal";

  @CreateDateColumn()
  createdAt!: Date;
}
