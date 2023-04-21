import { Controller, Get, Post, Body, Param, Res } from "@nestjs/common";
import { ListingDto } from "./dto";
import { UserListingsService } from "./userListings.services";
import { ObjectId } from "mongoose";
import { ObjectIdPipe } from "src/pipes/object-id.pipe";

@Controller('userListings')
export class UserListingsController {
    constructor(private readonly listingsService: UserListingsService) { }

    @Get('fetch/:userID')
    async getListings(@Param('userID', ObjectIdPipe) uid: ObjectId) {
        return await this.listingsService.getListings(uid);
    }

    @Post('deleteListing')
    async deleteListing(@Body('listingID', ObjectIdPipe) listingID: ObjectId,
        @Body('userID', ObjectIdPipe) uid: ObjectId) {
        return await this.listingsService.deleteListing(listingID, uid);
    }

    @Post('shareListing')
    async shareListing(@Body('listingID', ObjectIdPipe) listingID: ObjectId,
        @Body('sharedUserID',  ObjectIdPipe) sharedUserID: ObjectId) {
            
        return await this.listingsService.shareListing(listingID, sharedUserID);
    }

    @Post('addListing')
    async addListing(
        @Body() dto: ListingDto) {
        return await this.listingsService.addListing(dto);
    }

    @Post('updateListing')
    async updateListing(
        @Body() dto: ListingDto) {
        return await this.listingsService.updateListing(dto);
    }

    @Post('create')
    async create() {
        await this.listingsService.create();
    }

}