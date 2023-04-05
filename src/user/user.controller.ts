import { Body, Controller } from "@nestjs/common";
import { Post } from "@nestjs/common";
import { UserService } from "./user.services";
import { UserDto } from "./dto";

@Controller('user')
export class UserController{
    constructor(private readonly userService: UserService) { }

    @Post('addUser')
    async addUser(@Body() dto: UserDto)
     {   console.log(dto);
        return await this.userService.addUser(dto);
    }
}