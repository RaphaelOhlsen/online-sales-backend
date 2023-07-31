import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class Migrate1689904811970 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'city',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            unsigned: true,
          },
          {
            name: 'state_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
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
            onUpdate: 'now()',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'city',
      new TableIndex({
        name: 'IDX_CITY_NAME',
        columnNames: ['name'],
      }),
    );

    await queryRunner.createForeignKey(
      'city',
      new TableForeignKey({
        name: 'FK_CITY_STATE',
        columnNames: ['state_id'],
        referencedTableName: 'state',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('city', 'FK_CITY_STATE');
    await queryRunner.dropIndex('city', 'IDX_CITY_NAME');
    await queryRunner.dropTable('city');
  }
}
