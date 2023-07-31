import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Migrate1688734003198 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            unsigned: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '63',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '127',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '127',
            isNullable: false,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '14',
            isNullable: false,
          },
          {
            name: 'cpf',
            type: 'varchar',
            length: '11',
            isNullable: false,
          },
          {
            name: 'type_user',
            type: 'int',
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
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
