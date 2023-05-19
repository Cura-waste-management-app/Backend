import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { ObjectId } from "mongoose";
import { MessageDto } from "./dto";
import { ChatService } from "./userChats.services";

@Controller('userChats')
export class UserChatsController {
    constructor(private readonly chatService: ChatService) { }

    @Get(':chatUserID')
    async getUserChats(@Param('chatUserID') chatUserID: ObjectId) {
        // console.log(query);
        return await this.chatService.getUserChats(chatUserID);
    }

    @Post('addMessage')
    async addMessage(@Body() dto: MessageDto) {
        await this.chatService.addMessage(dto);
    }
    @Get('get-conversation-partners/:userId')
    async getConversationPartners(@Param('userId') userId:ObjectId){
          return  this.chatService.getConversationPartners(userId);
    }
    @Post('add-conversation-partners/:userId/:chatUser')
    async addConversationPartners(@Param('userId') userId:ObjectId,@Param('chatUser') chatUser:ObjectId){
          return  this.chatService.addConversationPartners(userId,chatUser);
    }
    @Post('subscribe/:groupId/:userId')
    async subscribe(@Param('userId') userId:ObjectId,@Param('groupId') groupId:ObjectId){
          return  this.chatService.subscribeConversation(groupId,userId);
    }
    @Post('unsubscribe/:groupId/:userId')
    async unsubscribe(@Param('userId') userId:ObjectId,@Param('groupId') groupId:ObjectId){
          return  this.chatService.unsubscribeConversation(groupId,userId);
    }
}