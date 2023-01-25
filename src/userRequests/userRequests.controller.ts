import { Controller, Get, Post, Body } from "@nestjs/common";

import { UserRequestsService } from "./userRequests.services";

@Controller('userRequests')
export class UserRequestsController {
    constructor(private readonly listingsService: UserRequestsService) { }

    @Get('fetch')
    async getUserRequests() {
        return await this.listingsService.getUserRequests();
    }

    @Post('deleteRequest')
    async deleteRequest(@Body('listingID') listingID: string) {
        return await this.listingsService.deleteRequest(listingID);
    }

    @Post('completeRequest')
    async completeRequest(@Body('listingID') listingID: string) {
        return await this.listingsService.completeRequest(listingID);
    }

    }
