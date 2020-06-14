import { Column, PrimaryColumn, Entity, ManyToOne } from "typeorm";
import { UserTable } from "./user-entity";
import { ProductTable } from "./product-entity";

export interface CartEntity {
    userId: Buffer;
    productId: Buffer;
    quantity: number
}

@Entity({ name: 'cart' })
export class CartTable implements CartEntity {
    @PrimaryColumn("binary", { length: 16, nullable: false, name: 'userId' })
    userId: Buffer;
    @PrimaryColumn("binary", { length: 16, nullable: false, name: 'productId' })
    productId: Buffer;
    @Column('decimal', { nullable: false, precision: 5, scale: 2 })
    quantity: number

    @ManyToOne(() => UserTable)
    user: UserTable

    @ManyToOne(() => ProductTable)
    product: ProductTable
}