import { Entity, ObjectIdColumn, ObjectId, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IsEmail, MinLength } from "class-validator";

@Entity("users")
export class User {
    @ObjectIdColumn()
    id!: ObjectId;

    @Column()
    @MinLength(3)
    username!: string;

    @Column({ unique: true })
    @IsEmail()
    email!: string;

    @Column()
    password!: string;
   
    @Column({ default: false })
    isEmailVerified!: boolean;

    @Column({ default: false })
    is2FAEnabled!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}