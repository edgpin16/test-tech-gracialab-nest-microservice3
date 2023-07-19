import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from './auth.guard';
import { UpdateUsersReservationDto } from './dto/update-users-reservation.dto';


@Controller()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(AuthGuard)
  @HttpCode(201)
  @Get()
  findAll() {
    return this.dashboardService.findAll();
  }

  @UseGuards(AuthGuard)
  @HttpCode(201)
  @Patch('/update')
  update(@Body() updateUsersReservationsDTO : UpdateUsersReservationDto){
    this.dashboardService.update(updateUsersReservationsDTO);
  }
}
