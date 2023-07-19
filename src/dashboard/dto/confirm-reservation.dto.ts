import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class ConfirmReservationDTO {
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    idReservation : number;
}