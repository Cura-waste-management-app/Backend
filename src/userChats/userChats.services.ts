import { Model, ObjectId } from "mongoose";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Message, messageDocument } from "src/schemas/message.schema";
import { ChatUser, chatUserDocument } from "src/schemas/chatUser.schema";
import { MessageDto } from "./dto";
import { ConversationPartner,  ConversationPartnerDocument } from "src/schemas/conversationPartner.schema";
import { ConversationPubSub, conversationPubSubDocument } from "src/schemas/conversation_pubsub.schema";
import { User, userDocument } from "src/schemas/user.schema";

@Injectable()
export class ChatService {
    constructor(@InjectModel(Message.name) private messageModel: Model<messageDocument>, @InjectModel(User.name) private userModel: Model<userDocument>,
        @InjectModel(ConversationPubSub.name) private conversationPubSubModel: Model<conversationPubSubDocument>,
        @InjectModel(ChatUser.name) private chatUserModel: Model<chatUserDocument>, @InjectModel(ConversationPartner.name) private conversationPartnerModel: Model<ConversationPartnerDocument>) { }

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
        var conversationPartners = await this.conversationPartnerModel.findById(userId).populate('usersList', '_id name avatarURL ');
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
    async subscribeConversation(groupId: ObjectId, userId: ObjectId,): Promise<any> {
       
        var present = true;
        console.log("here");
        if (present) {
           await this.conversationPubSubModel.findByIdAndUpdate(groupId, { $addToSet: { subscribers: userId } },{ upsert: true })
        }
        else {
            throw new Error('User with id ${userId} dosent exist')

        }

    }
    async unsubscribeConversation(groupId: ObjectId, userId: ObjectId,): Promise<any> {
        console.log('here');
        var present = true;
        if (present) {
            await this.conversationPubSubModel.findByIdAndUpdate(groupId, { $pull: { subscribers: userId } })

        }
        else {
            throw new Error('User with id ${userId} dosent exist')

        }

    }
}

