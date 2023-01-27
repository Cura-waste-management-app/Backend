import { Controller, Get, Post, Body, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ListingDto } from "./dto";
import { Express } from 'express';
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

    @Post('addListing')
    @UseInterceptors(FileInterceptor('file'))
    async addListing(
        @Body() dto: ListingDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1000000 }), // these validators already have access to uploaded file
                    new FileTypeValidator({ fileType: 'image/jpeg' || 'image/png' || 'image/jpg' }),
                ],
            })
        ) file: Express.Multer.File) {
        return await this.listingsService.addListing(dto, file);
    }

}