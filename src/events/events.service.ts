import {  HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Mongoose, ObjectId } from 'mongoose';
import { Community, communityDocument } from 'src/schemas/community.schema';
import { CommunityMember, CommunityMemberDocument } from 'src/schemas/community_members.schema';
import { EventMembers, eventMembersDocument } from 'src/schemas/eventMembers.schema';
import { Events, eventDocument } from 'src/schemas/events.schema';
import { JoinedCommunities, joinedCommunitiesDocument } from 'src/schemas/joined_communities.schema';
import { User, userDocument } from 'src/schemas/user.schema';
import { EventsDto } from './dto/events.dto';
import { JoinedEvents, joinedEventsDocument } from 'src/schemas/joinedevents.schema';
import {createHash} from 'crypto';
// import  createHash  from 'crypto';





@Injectable()
export class EventsService {
    constructor(@InjectModel(Community.name) private communityModel: Model<communityDocument>,  @InjectModel(User.name) private userModel: Model<userDocument>,
    @InjectModel(CommunityMember.name) private communityMemberModel: Model<CommunityMemberDocument>, @InjectModel(JoinedCommunities.name) private joinedCommunitiesModel: Model<joinedCommunitiesDocument>,
    @InjectModel(Events.name) private eventsmodel: Model<eventDocument>, @InjectModel(EventMembers.name) private eventmembersmodel: Model<eventMembersDocument>,
    @InjectModel(JoinedEvents.name) private joinedeventsmodel: Model<joinedEventsDocument>)
    {    }

    async addNewEvent(dto: EventsDto, communityId: string, creatorId: ObjectId): Promise<any>
    {
        const community = await this.communityMemberModel.findById(new mongoose.Types.ObjectId(communityId));
        console.log(community);
      const creator = await this.userModel.findById(creatorId);
         console.log(creator);


        const create = await this.communityMemberModel.find({_id:communityId, members: { $in : [creator._id]}})
        console.log("hei")
            console.log(create)
        

        //  const members =  community.members;
        //  console.log(members);       

        if(!community)
         {
             throw new Error('community with id ${communityId} not found' )

         }

        if(!creator)
        {
            throw new Error('creator with id ${creatorId} not found')
        }

        if(!create)
        {
            throw new Error('User with id ${creatorId} has not joined the community ${communityId}')
        }

        else
        {
            const data = {
                        name: dto.name,
                        description: dto.description,
                        location: dto.location,
                        imgURL: dto.imgURL,
                        communityId: community,
                        creatorId: creator,
                    }
                    try{
                                const event = await new this.eventsmodel(data).save();
                                const data1 = {
                                    _id: event._id,
                                    members: [ creator._id]
                                }
                                await new this.eventmembersmodel(data1).save()
                                await this.communityModel.findByIdAndUpdate(new mongoose.Types.ObjectId(communityId),{$push: {events: event._id }})
                                
                             
                            }
                            catch(err)
                            {
                                console.log(err);
                                return err;
                                
                            }
        }      
    }

    async joinEvent(communityId: ObjectId, userId: string, eventId: string ): Promise<any>
        {
            const user = await this.userModel.findById(new mongoose.Types.ObjectId(userId))
            console.log(user);
            const community = await this.communityModel.findById(communityId);
            console.log(community);
            if(!user)
            {
                throw new HttpException("User dosent exist", HttpStatus.NOT_FOUND);    
            }
    
            if(!community)
            {
                throw new HttpException('The community does not exist', HttpStatus.NOT_FOUND);
    
            }
            const event = await this.eventsmodel.findById(new mongoose.Types.ObjectId(eventId));
            console.log(event)
            const eventCheck = await this.communityModel.find({_id: communityId, events:{$in: [event._id]}})
             if(!eventCheck)
             {
                throw new HttpException('This event dosent exist in the community', HttpStatus.NOT_FOUND)
             }

            const create = await this.communityMemberModel.find({_id:communityId, members: { $in : [user._id]}})
            if(!create)
            {
                throw new Error('User with id ${creatorId} has not joined the community ${communityId}')
                }
            else
            {
                try{

                    const output = createId(communityId, userId)

                    
                //     const id =  userId + communityId
                //     console.log(id)
                //     const bytes = Buffer.from(id,'hex')
                //    const hash_object =  createHash('sha256')
                //    hash_object.update(bytes);
                //    const output_bytes =  hash_object.digest();
                //    const output_str = output_bytes.toString('hex').slice(40)
                    
                //     console.log(output_str)

                //     const output = new mongoose.Types.ObjectId(output_str) 
                    const data ={
                        _id: output,
                        joinedevents: [eventId]
                    }
                    console.log('hei')
                     
                    const user = await this.joinedeventsmodel.findById(output)
                    await this.eventmembersmodel.findByIdAndUpdate(new mongoose.Types.ObjectId(eventId), {$push: {members: user._id}})
                    if(!user)
                    {
                        await new this.joinedeventsmodel(data).save();
                    }
                    else
                    {
                        
                        return  await this.joinedeventsmodel.findByIdAndUpdate(output, {$push: {joinedevents: event._id }})
                        
                    }
                   

                }
                catch(error)
                {
                    console.log(error);
                    return error;
                }

            }


                

        }


        async getMyEvents(communityId: ObjectId, userId: string): Promise<any>
        {
            const community = await this.communityModel.findById(communityId);
            const user = await this.userModel.findById(new mongoose.Types.ObjectId(userId))
            if(!user)
            {
                throw new HttpException("User dosent exist", HttpStatus.NOT_FOUND);   
            }

        if(!community)
        {
            throw new HttpException("Community Dosent Exist", HttpStatus.NOT_FOUND);
        }
        else
        {
            try{
                const output = createId(communityId, userId);
                const event = await this.joinedeventsmodel.findById(output).populate('joinedevents')
                if(!event)
                {
                    throw new HttpException("Events not found", HttpStatus.NOT_FOUND);

                }
                return event;



            }
            catch(err)
            {
                console.log(err);
                return err;

            }

        }
            
        }

        async updateEventById(dto: EventsDto, eventId: string): Promise<any>
        {
        //     const community = await this.communityMemberModel.findById(communityId);
        // console.log(community);
                const data = {
                    name: dto.name,
                    description: dto.description,
                    location: dto.location,
                    imgURL: dto.imgURL,
                 
                    
                }
                console.log(data.name)
                console.log(typeof(data.name))

               return  await this.eventsmodel.findByIdAndUpdate(new mongoose.Types.ObjectId(eventId), {$set: {description: data.description, name: data.name,imgURL: data.imgURL, location:data.location}})

                // await this.eventsmodel.findByIdAndUpdate(new mongoose.Types.ObjectId(eventId), {$push: {name: data}}) //description: data.description, location: data.description, imgURL: data.imgURL//

            }


            

        



        }
    

    function createId(communityId: ObjectId, userId: string): any {
        const id =  userId + communityId
                console.log(id)
                const bytes = Buffer.from(id,'hex')
               const hash_object =  createHash('sha256')
               hash_object.update(bytes);
               const output_bytes =  hash_object.digest();
               const output_str = output_bytes.toString('hex').slice(40)
                
                console.log(output_str)

                const output = new mongoose.Types.ObjectId(output_str) 

                return output;
        

        
    }

