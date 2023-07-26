import { MigrationInterface, QueryRunner } from 'typeorm';
import statesData from '../data/states-data';

export class Migrate1689906602563 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO state (id, name, uf) VALUES
      ${statesData
        .map((state) => `(${state.id}, '${state.name}', '${state.uf}')`)
        .join(', ')}
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM state`);
  }
}
