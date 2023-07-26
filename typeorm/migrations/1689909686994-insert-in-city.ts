import { MigrationInterface, QueryRunner } from 'typeorm';
import citiesData from '../data/cities-data';

export class Migrate1689909686994 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO city (id, name, state_id) VALUES
      ${citiesData
        .map((city) => `(${city.id}, '${city.name}', '${city.state_id}')`)
        .join(', ')}
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM city`);
  }
}
