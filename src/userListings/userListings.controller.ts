import { Controller, Get, Post, Body } from "@nestjs/common";

import { UserListingsService } from "./userListings.services";

@Controller('userListings')
export class UserListingsController {
    constructor(private readonly listingsService: UserListingsService) { }

    @Get('fetch')
    async getListings() {       
        return await this.listingsService.getListings();
    }

    @Post('deleteListing')
    async deleteListing(@Body('listingID') listingID: string) {     
        return await this.listingsService.deleteListing(listingID);
    }

    @Post('shareListing')
    async shareListing(@Body('listingID') listingID: string) {     
        return await this.listingsService.shareListing(listingID);
    }

    @Get('create')
    async create() {       
        return await this.listingsService.create();
    }

}