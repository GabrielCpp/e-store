import { Column, PrimaryColumn, Entity } from "typeorm";

export interface ProductEntity {
    id: Buffer;
    name: string;
    description: string;
    price: number
}

@Entity({ name: 'product' })
export class ProductTable implements ProductEntity {
    @PrimaryColumn("binary", { length: 16, nullable: false })
    id: Buffer;
    @Column({ nullable: false })
    name: string;
    @Column({ nullable: false })
    description: string;
    @Column('decimal', { nullable: false, precision: 5, scale: 2 })
    price: number
}