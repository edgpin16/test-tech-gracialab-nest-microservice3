import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersReservationDto } from './create-users-reservation.dto';

export class UpdateUsersReservationDto extends PartialType(CreateUsersReservationDto) {}
