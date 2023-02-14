import { Controller, Get, Req } from '@nestjs/common';
import { get } from 'http';

@Controller('auth')
export class AuthController {
    constructor()
    {

    }
    
    @Get('/helloauth')
    getHello(@Req() request: Request ): string
    {
        return 'Hello ';

    }
}
