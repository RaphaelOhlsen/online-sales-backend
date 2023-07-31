import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createTableCart1675854227354 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the "cart" table
    await queryRunner.createTable(
      new Table({
        name: 'cart',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment', // This indicates the column will auto-increment
          },
          {
            name: 'user_id',
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

    // Create a foreign key constraint between "user_id" column in "cart" table and "id" column in "user" table
    await queryRunner.createForeignKey(
      'cart',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user', // Replace 'user' with the actual name of the user table if different
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key constraint
    const cartTable = await queryRunner.getTable('cart');
    const foreignKey = cartTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('user_id') !== -1,
    );
    await queryRunner.dropForeignKey('cart', foreignKey);

    // Drop the "cart" table
    await queryRunner.dropTable('cart', true);
  }
}
