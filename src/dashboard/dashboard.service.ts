import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUsersReservationDto } from './dto/create-users-reservation.dto';
import { UpdateUsersReservationDto } from './dto/update-users-reservation.dto';

import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class DashboardService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository : Repository<User>,

    @InjectRepository(Reservation)
    private readonly reservationRepository : Repository<Reservation>,
  ){}

  async findAll() {
    try{

      const reservationsWithUsers : Reservation[] = await 
        this.reservationRepository
        .createQueryBuilder("reservations")
        .innerJoinAndSelect("reservations.user", "user")
        .select(
          [
            "reservations.id",
            "reservations.reservation_date",
            "reservations.reservation_type",
            "reservations.people_quantity",
            "reservations.description",
            "reservations.observation",
            "reservations.is_confirm",
            "user.identificacion_document",
            "user.type_rol",
            "user.name",
            "user.last_name",
            "user.type_document",
            "user.email",
          ]
        )
        .getMany();

      return reservationsWithUsers;
    }
    catch(err){
      console.log("Ocurrio un error");;
      return {
        message : "Ocurrio un error",
        err,
        name : err.name
      }
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} dashboard`;
  }

  // update(id: number, updateDashboardDto: UpdateDashboardDto) {
  //   return `This action updates a #${id} dashboard`;
  // }

  remove(id: number) {
    return `This action removes a #${id} dashboard`;
  }
}

// const queryGetAllReservationsWithUsers : string 
      //   = `SELECT * FROM reservations INNER JOIN users ON reservations.ID_users = users.identificacion_document`;

      // const reservationsWithUsers : CreateUsersReservationDto[] = await this.reservationRepository.query(queryGetAllReservationsWithUsers);