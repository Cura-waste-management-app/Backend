import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { ObjectId } from "mongoose";
import { ObjectIdPipe } from "src/pipes/object-id.pipe";

import { HomeListingsService } from "./homeListings.services";

@Controller('homeListings')
export class HomeListingsController {
    constructor(private readonly listingsService: HomeListingsService) { }

    @Get('homeproducts/:userID')
    async getProducts(@Param('userID', ObjectIdPipe) uid: ObjectId) {
        return await this.listingsService.getProducts(uid);
    }

    

    }
