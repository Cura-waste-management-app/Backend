import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { MessageDto } from "./dto";
import { ChatService } from "./userChats.services";

@Controller('userChats')
export class UserChatsController {
    constructor(private readonly chatService: ChatService) { }

    @Get(':chatUserID')
    async getUserChats(@Param('chatUserID') chatUserID: String) {
        // console.log(query);
        return await this.chatService.getUserChats(chatUserID);
    }

    @Post('addMessage')
    async addMessage(@Body() dto: MessageDto) {
        await this.chatService.addMessage(dto);
    }

}