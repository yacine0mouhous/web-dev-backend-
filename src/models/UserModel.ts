import { ObjectId } from "mongodb";
import { Entity, ObjectIdColumn, Column } from "typeorm";

@Entity("users")
export class User {
  @ObjectIdColumn()
  _id!: ObjectId; // Change ObjectId to string

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  password?: string;

  @Column()
  fullName!: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  googleId?: string;

  @Column({ default: "client" })
  role?: "admin" | "owner" | "client";

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ default: false })
  isVerified?: boolean;

  @Column({ type: "json", nullable: true })
  profileData?: {
    creditScore?: number;
    rentalHistory?: string[];
    documents?: string[];
  };

  @Column({ type: "json", nullable: true })
  preferences?: {
    preferredRentRange?: number[];
    preferredLocation?: string;
    notificationsEnabled?: boolean;
  };

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;
}
