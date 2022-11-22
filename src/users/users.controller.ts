import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from './users.service';
import { User as UserModel } from '@prisma/client';

@Controller('users')
export class UsersController {

    constructor
    (
        private readonly userService: UsersService,
    )
    {}


    @Post('user')
    async signupUser(
        @Body() userData: {name?: string; email: string, country: string, gender: string, location: {lat: string, lot: string}},

    ): Promise<UserModel> {
        return this.userService.createUser(userData);
    }

 
}
