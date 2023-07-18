import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";

enum typeReservations {
    cena = 'cena',
    almuerzo = 'almuerzo',
    onces = 'onces',
    cumpleanos = 'cumplea#os',
    ocasion_especial = 'ocasion especial'
};

//El objeto literal en el decorador hace referencia a una tabla existente en la BD
@Entity({name : 'reservations'})
export class Reservation{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type : 'text',
    })
    ID_users : string;

    @Column({
        type : 'date'
    })
    reservation_date : Date;

    @Column({
        type : 'enum',
        enum : typeReservations
    })
    reservation_type : string;

    @Column({
        type : 'integer',
    })
    people_quantity : number;

    @Column({
        type : 'text',
    })
    description : string;

    @Column({
        type : 'text',
    })
    observation : string;

    @Column({
        type : 'boolean',
        default : 0
    })
    is_confirm : number

    @ManyToOne((type) => User, (user) => user.reservations)
    @JoinColumn({ name : "ID_users", referencedColumnName: "identificacion_document" })
    user?: User
}
