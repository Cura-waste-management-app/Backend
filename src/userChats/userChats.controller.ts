import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { ObjectId } from "mongoose";
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
        console.log("here");
        await this.chatService.addMessage(dto);
    }
    @Get('get-conversation-partners/:userId')
    async getConversationPartners(@Param('userId') userId:ObjectId){
        console.log('here')
          return  this.chatService.getConversationPartners(userId);
    }
    @Post('add-conversation-partners/:userId/:chatUser')
    async addConversationPartners(@Param('userId') userId:ObjectId,@Param('chatUser') chatUser:ObjectId){
        console.log('here')
          return  this.chatService.addConversationPartners(userId,chatUser);
    }

}