import { MigrationInterface, QueryRunner, TableColumn, Table } from "typeorm";

export class PostRefactoring1596762929644 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'product',
            columns: [
                new TableColumn({
                    name: 'id',
                    type: 'binary',
                    length: '16',
                    isNullable: false
                }),
                new TableColumn({
                    name: 'name',
                    type: 'varchar',
                    length: '255',
                    isNullable: false
                }),
                new TableColumn({
                    name: 'description',
                    type: 'varchar',
                    length: '255',
                    isNullable: false
                }),
                new TableColumn({
                    name: 'price',
                    type: 'decimal',
                    precision: 5,
                    scale: 2,
                    isNullable: false
                }),
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
