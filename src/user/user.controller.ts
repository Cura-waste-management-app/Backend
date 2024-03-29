import { Body, Controller, Get, Param } from "@nestjs/common";
import { Post } from "@nestjs/common";
import { UserService } from "./user.services";
import { UserDto } from "./dto";
import { ObjectIdPipe } from "src/pipes/object-id.pipe";
import { ObjectId } from "mongoose";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('addUser')
    async addUser(@Body() dto: UserDto) {
        return await this.userService.addUser(dto);
    }

    @Get('fetch/:userID')
    async getUserInfo(@Param('userID', ObjectIdPipe) uid: ObjectId){
        return await this.userService.getUserInfo(uid);
    }

    @Get('getUserByFirebaseUID/:firebaseUID')
    async getUserByFirebaseUID(@Param('firebaseUID') firebaseUID: string){
        return await this.userService.getUserByFirebaseUID(firebaseUID);
    }

    @Post('updateUser')
    async updateUser(@Body() dto: UserDto) {
        return await this.userService.updateUser(dto);
    }

    @Post('addUci')
    async addUCI(@Body() args: Object)
    {
        return await this.userService.addUCI(args['name']);
    }
}