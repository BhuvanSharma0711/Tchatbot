import { IsEmail, IsNotEmpty, IsString } from "class-validator"

class UserInfoDto {
    @IsNotEmpty()
    @IsString()
    name:string

    @IsNotEmpty()
    @IsString()
    UID_type:string

    @IsNotEmpty()
    @IsString()
    UID:string

    @IsNotEmpty()
    @IsEmail()
    email: string   
}

export default UserInfoDto;