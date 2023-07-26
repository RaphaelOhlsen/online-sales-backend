import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class Migrate1689905048437 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'address',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'complement',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'number',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'cep',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'city_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'address',
      new TableIndex({
        name: 'IDX_ADDRESS_CEP',
        columnNames: ['cep'],
      }),
    );

    await queryRunner.createForeignKey(
      'address',
      new TableForeignKey({
        name: 'FK_ADDRESS_USER',
        columnNames: ['user_id'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'address',
      new TableForeignKey({
        name: 'FK_ADDRESS_CITY',
        columnNames: ['city_id'],
        referencedTableName: 'city',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('address', 'FK_ADDRESS_USER');
    await queryRunner.dropForeignKey('address', 'FK_ADDRESS_CITY');
    await queryRunner.dropIndex('address', 'IDX_ADDRESS_CEP');
    await queryRunner.dropTable('address');
  }
}
