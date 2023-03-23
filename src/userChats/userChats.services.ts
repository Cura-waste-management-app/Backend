import { Model } from "mongoose";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Message, messageDocument } from "src/schemas/message.schema";
import { ChatUser, chatUserDocument } from "src/schemas/chatUser.schema";
import { MessageDto } from "./dto";

@Injectable()
export class ChatService {
    constructor(@InjectModel(Message.name) private messageModel: Model<messageDocument>,
        @InjectModel(ChatUser.name) private chatUserModel: Model<chatUserDocument>) { }

    async getUserChats(chatUserID: String): Promise<any> {

        const uid = "1";
        try {

            var messagesDoc = await this.messageModel.find({
                $or: [
                    { senderID: uid, receiverID: chatUserID },
                    { senderID: chatUserID, receiverID: uid }
                ]
            });

            if (!messagesDoc) {
                throw new HttpException('No messages found', HttpStatus.NOT_FOUND);
            }
            // console.log(messagesDoc);
            return messagesDoc;

        }
        catch (error) {
            console.log(error);
            return error;
        }
    };

    async addMessage(dto: MessageDto): Promise<any> {
    
        var message = {
            senderID: dto.senderID,
            receiverID: dto.receiverID,
            messageContent: dto.messageContent,
            timeStamp: dto.timeStamp,
            imgURL: dto.imgURL
        };
        await new this.messageModel(message).save();
    }


}

