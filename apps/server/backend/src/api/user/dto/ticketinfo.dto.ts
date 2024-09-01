import { IsBoolean, IsDate, IsNotEmpty, IsNumber } from "class-validator"

class ticketinfoDto {
    @IsBoolean()
    @IsNotEmpty()
    show1:boolean

    @IsBoolean()
    @IsNotEmpty()
    show2:boolean

    date:Date

    @IsNotEmpty()
    @IsNumber()
    numbTicket:number

    @IsBoolean()
    @IsNotEmpty()
    payment:boolean
}

export default ticketinfoDto