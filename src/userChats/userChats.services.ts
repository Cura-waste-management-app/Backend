import mongoose, { Model, ObjectId } from "mongoose";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Message, messageDocument } from "src/schemas/message.schema";
import { ChatUser, chatUserDocument } from "src/schemas/chatUser.schema";
import { MessageDto } from "./dto";
import { ConversationPartner, ConversationPartnerDocument } from "src/schemas/conversationPartner.schema";
import { ConversationPubSub, conversationPubSubDocument } from "src/schemas/conversation_pubsub.schema";
import { User, userDocument } from "src/schemas/user.schema";
import { JoinedEvents, joinedEventsDocument } from "src/schemas/joinedevents.schema";
import { async } from "rxjs";
import { JoinedCommunities, joinedCommunitiesDocument } from "src/schemas/joined_communities.schema";

@Injectable()
export class ChatService {
    constructor(@InjectModel(Message.name) private messageModel: Model<messageDocument>, @InjectModel(User.name) private userModel: Model<userDocument>,
        @InjectModel(ConversationPubSub.name) private conversationPubSubModel: Model<conversationPubSubDocument>, @InjectModel(JoinedEvents.name) private joinedeventsmodel: Model<joinedEventsDocument>,
        @InjectModel(JoinedCommunities.name) private joinedCommunitiesModel: Model<joinedCommunitiesDocument>,
        @InjectModel(ChatUser.name) private chatUserModel: Model<chatUserDocument>, @InjectModel(ConversationPartner.name) private conversationPartnerModel: Model<ConversationPartnerDocument>) { }

    async getUserChats(chatUserID: ObjectId): Promise<any> {

        try {

            // var message = {
            //     senderID: 2,
            //     receiverID: "1",
            //     messageContent: "Awesome!",
            //     timeStamp: "9.00 pm",
            //     imgURL: "assets/pl.png"
            // };
            // await new this.messageModel(message).save();

            var joinedCommunitiesDoc = (await this.joinedCommunitiesModel.findById(chatUserID));
            var events = await this.joinedeventsmodel.find({ userId: chatUserID }, { joinedevents: 1, _id: 0 })
            var joinedEventsList = [];
            if (events && events[0]) joinedEventsList = events[0].joinedevents;
            var conversationPartnersList = [];
            if (joinedCommunitiesDoc) conversationPartnersList = joinedCommunitiesDoc.joinedCommunities;
            conversationPartnersList.push(...joinedEventsList)
            conversationPartnersList.push(chatUserID.toString());
            console.log(chatUserID, conversationPartnersList);
            var messagesDoc = await this.messageModel.find({
                $or: [
                    { receiverId: { $in: conversationPartnersList } },
                    { senderId: chatUserID }
                ]
            }).sort({ createdAt: -1 });

            if (!messagesDoc) {
                throw new HttpException('No messages found', HttpStatus.NOT_FOUND);
            }

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
        var communityList = await this.joinedCommunitiesModel.findById(userId).populate('joinedCommunities', '_id name imgURL');
        var events = await this.joinedeventsmodel.find({ userId: userId }).populate('joinedevents', '_id name imgURL');
        var eventList = events.map(item => item.joinedevents)[0];
        var result = {
            userList: conversationPartners ? conversationPartners['usersList'] : [],
            communityList: communityList ? communityList.joinedCommunities : [],
            eventList: eventList ? eventList : []
        };
        return result;
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
            await this.conversationPubSubModel.findByIdAndUpdate(groupId, { $addToSet: { subscribers: userId } }, { upsert: true })
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

