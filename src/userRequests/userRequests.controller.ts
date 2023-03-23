import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { ObjectId } from "mongoose";
import { ObjectIdPipe } from "src/pipes/object-id.pipe";

import { UserRequestsService } from "./userRequests.services";

@Controller('userRequests')
export class UserRequestsController {
    constructor(private readonly listingsService: UserRequestsService) { }

    @Get('fetch/:userID')
    async getUserRequests(@Param('userID', ObjectIdPipe) uid: ObjectId) {
        return await this.listingsService.getUserRequests(uid);
    }

    @Post('addRequest')
    async addRequest(@Body('listingID', ObjectIdPipe) listingID: ObjectId,
    @Body('userID', ObjectIdPipe) uid: ObjectId){
       
        return await this.listingsService.addRequest(listingID, uid);
    }

    @Post('deleteRequest')
    async deleteRequest(@Body('listingID', ObjectIdPipe) listingID: ObjectId,
    @Body('userID', ObjectIdPipe) uid: ObjectId) {
        return await this.listingsService.deleteRequest(listingID, uid);
    }

    @Post('receiveListing')
    async completeRequest(@Body('listingID',  ObjectIdPipe) listingID: ObjectId,
    @Body('uid', ObjectIdPipe) uid: ObjectId) {
        return await this.listingsService.ReceiveListing(listingID, uid);
    }

    }
