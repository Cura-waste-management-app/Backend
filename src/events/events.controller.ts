import { Body, Controller, Param, Post } from '@nestjs/common';
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
        @Param('communityId') communityId: string, 
        @Param('creatorId') creatorId: ObjectId
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
}
