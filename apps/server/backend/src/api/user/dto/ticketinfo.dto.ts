import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator"

class ticketinfoDto {
    @IsBoolean()
    @IsNotEmpty()
    show1:boolean

    @IsBoolean()
    @IsNotEmpty()
    show2:boolean

    @IsNotEmpty()
    @IsNumber()
    numbTicket:number

    
}

export default ticketinfoDto