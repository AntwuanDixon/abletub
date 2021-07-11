import { Migration } from '@mikro-orm/migrations';

export class Migration20210612221022 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "email" text not null, "username" text not null, "password" text not null);');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
    this.addSql('alter table "user" add column "email text not null;');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
  }

}
