import { Controller, Get } from "@nestjs/common";
import { UserListingsService } from "./userListings.services";

@Controller('userListings')
export class UserListingsController {
    constructor(private readonly listingsService: UserListingsService) { }

    @Get('fetch')
    async getList() {
        return await this.listingsService.shareListing('63c6a1cfa03b4c9ba4e7283f');
    }


}