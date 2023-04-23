import {IsNotEmpty} from 'class-validator';

export class UserDto{

    uid: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    role: string;

    emailID: string;

    avatarURL: string;

    uciCode: string;

    @IsNotEmpty()
    location: string

}

// do all validation on fields here