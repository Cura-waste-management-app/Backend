import { Model, ObjectId } from "mongoose";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Message, messageDocument } from "src/schemas/message.schema";
import { ChatUser, chatUserDocument } from "src/schemas/chatUser.schema";
import { MessageDto } from "./dto";
import { ConversationPartner } from "src/schemas/conversationPartner.schema";

@Injectable()
export class ChatService {
    constructor(@InjectModel(Message.name) private messageModel: Model<messageDocument>,
        @InjectModel(ChatUser.name) private chatUserModel: Model<chatUserDocument>, @InjectModel(ConversationPartner.name) private conversationPartnerModel: Model<ConversationPartner>) { }

    async getUserChats(chatUserID: String): Promise<any> {

        const uid = "00000001c2e6895225b91f71";
        try {

            // var message = {
            //     senderID: 2,
            //     receiverID: "1",
            //     messageContent: "Awesome!",
            //     timeStamp: "9.00 pm",
            //     imgURL: "assets/pl.png"
            // };
            // await new this.messageModel(message).save();


            var messagesDoc = await this.messageModel.find({
                $or: [
                    { receiverId: chatUserID },
                    { senderId: chatUserID }
                ]
            }).sort({ createdAt: -1 });

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
            senderId: dto.senderId,
            receiverId: dto.receiverId,
            content: dto.content,
            createdAt: dto.createdAt
            // messageContent: dto.messageContent,
            // timeStamp: dto.timeStamp,
            // imgURL: dto.imgURL
        };
        await new this.messageModel(message).save();
    }
    async getConversationPartners(userId: ObjectId) {
        //TODO: add all validations......
        var conversationPartners = await this.conversationPartnerModel.findById(userId);
        return conversationPartners;
    }
    async addConversationPartners(userId: ObjectId, chatUser: ObjectId) {
        try {
            await this.conversationPartnerModel.findByIdAndUpdate(userId, { $addToSet: { usersList: chatUser } }, { upsert: true });
            await this.conversationPartnerModel.findByIdAndUpdate(chatUser, { $addToSet: { usersList: userId } }, { upsert: true });

        } catch (error) {
            console.error(error);
        }

    }

}

