import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { User } from './entities/user.entity';
import { Reservation } from './entities/reservation.entity';
import { MailingService } from 'src/mailing/mailing.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [
    TypeOrmModule.forFeature([ User, Reservation ]),
    JwtModule.register({
      secret: process.env.SECRET_JWT || 'THIS IS A SECRET JWT',
      signOptions: {expiresIn: '7200s'}
    }),
    MailingService
  ],
})
export class DashboardModule {}
