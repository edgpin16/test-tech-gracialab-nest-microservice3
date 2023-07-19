import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { User } from './entities/user.entity';
import { Reservation } from './entities/reservation.entity';
import { MailingModule } from 'src/mailing/mailing.module';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [
    TypeOrmModule.forFeature([ User, Reservation ]),
    JwtModule.register({
      secret: process.env.SECRET_JWT || 'THIS IS A SECRET JWT',
      signOptions: {expiresIn: '7200s'}
    }),
    MailingModule
  ],
})
export class DashboardModule {}
