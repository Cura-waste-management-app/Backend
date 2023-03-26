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
// import  createHash  from 'crypto'
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
                     
                 
                    await this.eventmembersmodel.findByIdAndUpdate(new mongoose.Types.ObjectId(eventId), {$push: {members: user._id}})
                    const newuser = await this.joinedeventsmodel.findById(output)
                    if(!newuser)
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
        const event = await this.eventsmodel.findById(new mongoose.Types.ObjectId(eventId));
        
        if(!event)
        {
            throw new HttpException('This event dosent exist', HttpStatus.NOT_FOUND)

        }
        else{
            try {
                const data = {
                    name: dto.name,
                    description: dto.description,
                    location: dto.location,
                    imgURL: dto.imgURL,
                 
                    
                }
                console.log(data.name)
                console.log(typeof(data.name))

               return  await this.eventsmodel.findByIdAndUpdate(new mongoose.Types.ObjectId(eventId), {$set: {description: data.description, name: data.name,imgURL: data.imgURL, location:data.location}})

                
            } catch (error) {
                console.log(error);
                return error;
                
            }
        }
                
                // await this.eventsmodel.findByIdAndUpdate(new mongoose.Types.ObjectId(eventId), {$push: {name: data}}) //description: data.description, location: data.description, imgURL: data.imgURL//
    }

            async getEventsByCommunityId(communityId: ObjectId, userId: string): Promise<any>
            {
                const user_id = new mongoose.Types.ObjectId(userId)
                const ouput = createId(communityId, userId);


                const allevents = (await this.communityModel.findById(communityId).populate('events'));
               

                var myevents = await this.getMyEvents(communityId,userId);
                myevents=myevents.joinedevents;
                // console.log(myevents.joinedevents)
                var exploreList = []
                //TODO: remove myEvent wehn everything finalisre
                var myeventsList= []
                // console.log("=========================");
                // console.log(myevents);

                
                for(var alleventsIndex=0;alleventsIndex<allevents.events.length;alleventsIndex++){                 
                //    console.log(allevents.events.at(alleventsIndex)['_id'],myevents.length);
                   var found=false;
                    for(var myeventsIndex=0; myeventsIndex<myevents.length;myeventsIndex++){
                        if(myevents.at(myeventsIndex)["_id"].equals(allevents.events.at(alleventsIndex)['_id'])){
                            found=true;
                            break;
                        }
                       
                    }
                    if(!found){
                        exploreList.push(allevents.events.at(alleventsIndex));
                    }
                    else{
                        myeventsList.push(allevents.events.at(alleventsIndex));
                    }
                }
                console.log(exploreList.length,myeventsList.length,allevents.events.length)
                // const result = allevents.events.filter(a => !myevents.find((b: => a.name === b.name))
                //     allevents.events.filter(itemA => !myevents.some(itemB => itemA._id === itemB._id))
                
            //   
            //   console.log(result)


            





                // for(const event in allevents)
                // {
                //     console.log(event)
                //     for(const e in myevents.joinedevents)
                //     {
                //         if(event!= e)
                //         {
                //             explore.push(event);
                            
                //         }

                //     }
                    
                // }
                    //  console.log(explore)

                const res = {
                    'myevents': myeventsList,
                    'explore':exploreList
                }
                return res
            } 

    async deleteEventById(communityId: ObjectId, userId: string,eventId: string): Promise<any>
            {
                const id = new mongoose.Types.ObjectId(eventId)
                const user_id = new mongoose.Types.ObjectId(userId)

                const community = await this.communityMemberModel.findById(communityId);
                const event = await this.eventsmodel.findById(new mongoose.Types.ObjectId(eventId));
        
        console.log(community);
      const creator = await this.userModel.findById(user_id);
         console.log(creator);


        const create = await this.communityMemberModel.find({_id:communityId, members: { $in : [creator._id]}})
        console.log("hei")
            console.log(create)
        
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

           const eventCheck = await this.communityModel.find({_id: communityId, events:{$in: [event._id]}})
           if(!eventCheck)
           {
              throw new HttpException('This event dosent exist in the community', HttpStatus.NOT_FOUND)
           }
           else{    
            const event = await this.eventsmodel.findById(new mongoose.Types.ObjectId(eventId));
            const event_members = await this.eventmembersmodel.findById(event._id)

            for(const user in event_members.members)
            {
                const output = createId(communityId, user)
                await this.joinedeventsmodel.findByIdAndUpdate(output, {$pull: {joinedevents: event._id } })
            }
           }





            }

            //TODO: CHECK IF SOMEONE IS PART OF THE EVENT OR COMMUNITY OR NOT



         async checkIfTheUserExistEvent(communityId: ObjectId, userId: string, eventId: string)
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

            const member = await this.communityMemberModel.find({_id:communityId, members: { $in : [user._id]}})
            if(!member)
            {
                throw new Error('User with id ${creatorId} has not joined the community ${communityId}')
             }

            

             const output = createId(communityId,userId)

             const checkEvent = await this.joinedeventsmodel.find({_id: output, joinedevents: {$in: [new mongoose.Types.ObjectId(eventId)]}})
             console.log(checkEvent)

             var present = true
             if(checkEvent.length == 0)
             {
                present = false
             }
             return present;

             
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

