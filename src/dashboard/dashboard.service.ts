import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
}
  from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { CreateUsersReservationDto } from './dto/create-users-reservation.dto';
import { UpdateUsersReservationDto } from './dto/update-users-reservation.dto';

import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Reservation } from './entities/reservation.entity';
import { ConfirmReservationDTO } from './dto/confirm-reservation.dto';
import { MailingService } from '../mailing/mailing.service';

@Injectable()
export class DashboardService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,

    private readonly mailingService : MailingService
  ) { }

  async findAll() {
    try {

      const reservationsWithUsers: Reservation[] = await
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
    catch (err) {
      console.log("Ocurrio un error");;
      return {
        message: "Ocurrio un error",
        err,
        name: err.name
      }
    }
  }

  async update(updateUsersReservationsDTO: UpdateUsersReservationDto) {

    const {
      identificacion_document,
      name,
      last_name,
      type_document,
      email,
      reservation_date,
      reservation_type,
      people_quantity,
      description,
      observation,
      idReservation
    } = updateUsersReservationsDTO;

    try {
      let reservation: Reservation = await this.reservationRepository.findOneBy(
        { id: idReservation });

      if (!reservation) throw new NotFoundException("La reservacion no existe");

      //Busco el usuario que esta asociado a la reservacion
      //No lo instancio con los datos enviados porque puede ser que deben ser editados
      let user: User = await this.userRepository.findOneBy(
        { identificacion_document: reservation?.ID_users });

      const userWithSameEmail: User = await this.userRepository.findOneBy({ email });

      //Si existe un usuario con el email a editar, y no es el mismo de la reserva
      if (userWithSameEmail &&
        user.identificacion_document !== userWithSameEmail?.identificacion_document)
        throw new Error("Ya existe otro usuario con ese email"); //Lanzas un error

      const userWithSameID: User = await this.userRepository.findOneBy({ identificacion_document });

      //Si existe un usuario con el documento de identificacion a editar
      //y no tienen el mismo email (Atributo unico)
      if (userWithSameID && user.email !== userWithSameID?.email)
        throw new Error("Ya existe otro usuario con ese documento de identificacion");

      //Validaciones pasadas :D

      console.log("Validaciones pasadas")

      user = {
        ...user,
        identificacion_document,
        name,
        last_name,
        type_document,
        email,
      }

      reservation = {
        ...reservation,
        reservation_date,
        reservation_type,
        people_quantity,
        description,
        observation
      }

      this.userRepository
      .createQueryBuilder()
      .update(User)
      .set(user)
      .where(`identificacion_document = :identificacion_document`, { identificacion_document : user.identificacion_document  })
      .execute();

      await this.reservationRepository
      .createQueryBuilder()
      .update(Reservation)
      .set(reservation)
      .where(`id = :id`, { id : reservation.id  })
      .execute();

      console.log({ user, reservation });

      return {user, reservation}      
    }
    catch (err) {
      console.log(err);
      return err;
    }
  }

  async confirmReservation( confirmReservationDto : ConfirmReservationDTO ){

    const {
      idReservation
    } = confirmReservationDto;

    let reservation: Reservation = await this.reservationRepository.findOneBy(
      { id: idReservation });

    if (!reservation) throw new NotFoundException("La reservacion no existe");

    reservation = {
      ...reservation,
      is_confirm : 1 // TRUE
    }

    await this.reservationRepository
      .createQueryBuilder()
      .update(Reservation)
      .set(reservation)
      .where(`id = :id`, { id : reservation.id  })
      .execute();

      this.sendEmail(reservation);

      return {message : "success"}
  }

  private async sendEmail(reservation : Reservation){

    try{
      const {ID_users} = reservation;
      const user = await this.userRepository.findOneBy({identificacion_document : ID_users});

      const result = await this.mailingService.sendMail(user.email || "edgardo.pinto16@gmail.com");
  
      return {
        message : "Email enviado con exito",
        result
      }
    }
    catch(error){
      console.log(error);
      return {
        message : "Error enviando el email",
        error
      }
    }
  }
}