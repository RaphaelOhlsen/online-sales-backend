import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createTableProduct1675766857443 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Cria a tabela 'product'
    await queryRunner.createTable(
      new Table({
        name: 'product',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'category_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'price',
            type: 'double precision',
            isNullable: false,
          },
          {
            name: 'image',
            type: 'varchar',
            length: '255',
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
            onUpdate: 'now()',
            isNullable: false,
          },
        ],
      }),
      true, // Define "true" para criar também as chaves estrangeiras
    );

    // Cria a chave estrangeira (foreign key) na tabela 'product' referenciando a tabela 'category'
    await queryRunner.createForeignKey(
      'product',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedTableName: 'category',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove a chave estrangeira na tabela 'product'
    await queryRunner.dropForeignKey('product', 'FK_product_category');

    // Remove a tabela 'product'
    await queryRunner.dropTable('product');
  }
}
