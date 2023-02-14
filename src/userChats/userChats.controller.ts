import { Controller, Get, Post, Body, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Query } from "@nestjs/common";
import { ChatService } from "./userChats.services";

@Controller('userChats')
export class UserChatsController {
    constructor(private readonly chatService: ChatService) { }

    @Get()
    async getListings() {
        // console.log(query);
        console.log("getuserChats");
        return [{
            'senderID' : '2',
           'receiverID' : '1',
            'messageContent': 'ok',
            'imgURL': '',
            'timeStamp': '9.00 pm'
        }];
    }
   
}