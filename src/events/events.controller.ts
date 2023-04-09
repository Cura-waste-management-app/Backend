import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsDto } from './dto/events.dto';
import { ObjectId } from 'mongoose';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService)
    {}

    @Post('createevent/:communityId/:creatorId')
    async createEvent(
        @Body() dto: EventsDto, 
        @Param('communityId') communityId: ObjectId, 
        @Param('creatorId') creatorId: string
    )
    {
        await this.eventsService.addNewEvent(dto, communityId, creatorId);
        
    }

    @Post('joinevent/:communityId/:userId/:eventId')
    async joinevent(
        @Param('communityId') communityId: ObjectId,
        @Param('userId') userId: string,
        @Param('eventId') eventId: string

    )
    {
        await this.eventsService.joinEvent(communityId,userId,eventId);

    }

    @Get('getmyevents/:communityId/:userId')
    async getmyevents(
        @Param('communityId') communityId: ObjectId,
        @Param('userId') userId: string
    )
    {
       return  await this.eventsService.getMyEvents(communityId,userId)
    }

    @Get('geteventsbycommunityid/:communityId/:userId')
    async geteventsbycommunityid(
        @Param('communityId') communityId: ObjectId,
        @Param('userId') userId: string
    )
    {
        return await this.eventsService.getEventsByCommunityId(communityId,userId)

    }
    @Get('getmembersbyeventid/:communityId/:eventId')
    async getmembersbyeventid(
        @Param('communityId') communityId: ObjectId,
        @Param('eventId') eventId: string
    )
    {
        return await this.eventsService.getUserByEvents(communityId,eventId)

    }

    @Get('checkifthememberexist/:communityId/:userId/:eventId')
    async checkifthememberexist(
        @Param('communityId') communityId: ObjectId,
        @Param('userId') userId: string,
        @Param('eventId') eventId: string
    ) 
    {
        return await this.eventsService.checkIfTheUserExistEvent(communityId, userId, eventId)
        
    }

    @Get('leaveevent/:communityId/:userId/:eventId')
    async leaveEventByUserId(
        @Param('communityId') communityId: ObjectId,
        @Param('userId') userId: string,
        @Param('eventId') eventId: string
    ) 
    {
        return await this.eventsService.leaveEvent(communityId, userId, eventId)
        
    }



    @Put('updateevent/:eventId')
    async updatevents(
        @Body() dto: EventsDto, 
        @Param('eventId') eventId: string

    )
    {
        return await this.eventsService.updateEventById(dto, eventId)
    }

    @Post('deleteevent/:communityId/:userId/:eventId')
    async deleteevent(
        @Param('communityId') communityId: ObjectId,
        @Param('userId') userId: string,
        @Param('eventId') eventId: string

    ) {

        return await this.eventsService.deleteEventById(communityId,userId,eventId)

        
    }

}
