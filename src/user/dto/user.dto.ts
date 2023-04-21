import {IsNotEmpty} from 'class-validator';

export class UserDto{

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    role: string;

    emailID: string;

    avatarURL: string;

    @IsNotEmpty()
    location: string

}

// do all validation on fields here