import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertRootInUser1675770516768 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('user') // Nome da tabela
      .values([
        {
          name: 'root',
          email: 'root@root.com',
          cpf: '12345678901',
          type_user: 2,
          phone: '31925325252',
          password:
            '$2b$10$Fxycin0Zv1rz9wGW2ev3Memt6hHsM.e7MfZ7gao7c7QsEafQyhDFC',
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('user')
      .where('email = :email', { email: 'root@root.com' })
      .execute();
  }
}
