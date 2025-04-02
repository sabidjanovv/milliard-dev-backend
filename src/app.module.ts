import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from './admin/admin.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { AddressModule } from './address/address.module';
import { DeveloperModule } from './developer/developer.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    AdminModule,
    MailModule,
    AuthModule,
    AddressModule,
    DeveloperModule,
    ProjectModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
