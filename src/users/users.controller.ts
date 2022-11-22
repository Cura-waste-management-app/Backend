import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Controller('users')
export class UsersController {

    constructor()
    {
        prisma: PrismaService
    }

 
}
