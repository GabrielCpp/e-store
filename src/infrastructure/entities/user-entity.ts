import { Column, PrimaryColumn, Entity } from "typeorm";

export interface UserEntity {
    id: Buffer;
    name: string;
    email: string;
}

@Entity({ name: 'user' })
export class UserTable implements UserEntity {
    @PrimaryColumn("binary", { length: 16, nullable: false })
    id: Buffer;
    @Column({ nullable: false })
    name: string;
    @Column({ nullable: false })
    email: string;
}