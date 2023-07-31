import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class crateTableCartProduct1675855589039 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the "cart_product" table
    await queryRunner.createTable(
      new Table({
        name: 'cart_product',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'cart_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'product_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'amount',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Create a foreign key constraint between "cart_id" column in "cart_product" table and "id" column in "cart" table
    await queryRunner.createForeignKey(
      'cart_product',
      new TableForeignKey({
        columnNames: ['cart_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'cart', // Replace 'cart' with the actual name of the cart table if different
        onDelete: 'CASCADE',
      }),
    );

    // Create a foreign key constraint between "product_id" column in "cart_product" table and "id" column in "product" table
    await queryRunner.createForeignKey(
      'cart_product',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'product', // Replace 'product' with the actual name of the product table if different
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key constraints
    const cartProductTable = await queryRunner.getTable('cart_product');
    let foreignKey = cartProductTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('cart_id') !== -1,
    );
    await queryRunner.dropForeignKey('cart_product', foreignKey);

    foreignKey = cartProductTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('product_id') !== -1,
    );
    await queryRunner.dropForeignKey('cart_product', foreignKey);

    // Drop the "cart_product" table
    await queryRunner.dropTable('cart_product', true);
  }
}
