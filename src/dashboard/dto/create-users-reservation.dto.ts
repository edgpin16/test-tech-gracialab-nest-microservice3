import { Transform } from "class-transformer";
import { 
    IsBoolean,
    IsDate,
    IsEnum, 
    IsNotEmpty, 
    IsNumber, 
    IsOptional, 
    IsPositive, 
    IsString, 
    MinDate, 
    MinLength,
    minDate, 
    } 
from "class-validator";

enum typeReservations {
    cena = 'cena',
    almuerzo = 'almuerzo',
    onces = 'onces',
    cumpleanos = 'cumplea#os',
    ocasion_especial = 'ocasion especial'
};

export class CreateUsersReservationDto {

    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    identificacion_document: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    type_rol?: number;
    
    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    name: string;

    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    last_name: string;

    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    type_document: string;

    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @Transform( ({ value }) => new Date(value))
    @IsDate()
    @MinDate(new Date(), {message : "La fecha elegida debe ser igual o superior"})
    reservation_date : Date;

    @IsEnum(typeReservations)
    @IsNotEmpty()
    reservation_type : string;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    people_quantity : number;

    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    description: string;

    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    observation: string;

    @IsBoolean()
    @IsOptional()
    is_confirm?: number;

}
