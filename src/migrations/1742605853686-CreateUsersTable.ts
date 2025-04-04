import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1742605853686 implements MigrationInterface {
  name = 'CreateUsersTable1742605853686';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "users"
    (
        "id"
        SERIAL
        NOT
        NULL,
        "password"
        character
        varying
        NOT
        NULL,
        "username"
        character
        varying
        NOT
        NULL,
        "createdAt"
        TIMESTAMP
        NOT
        NULL
        DEFAULT
        now
                             (
                             ),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now
                             (
                             ),
        CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE
                             (
                                 "username"
                             ),
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY
                             (
                                 "id"
                             )
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
