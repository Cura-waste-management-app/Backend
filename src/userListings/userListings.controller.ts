import { Controller, Get } from "@nestjs/common";
import { UserListingsService } from "./userListings.services";

@Controller('userListings')
export class UserListingsController {
    constructor(private readonly listingsService: UserListingsService) { }

    @Get('fetch')
    async getList() {
        return await this.listingsService.getUserListings();
    }


}