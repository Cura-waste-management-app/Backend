import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { ObjectId } from "mongoose";
// import { ObjectIdPipe } from "src/pipes/object-id.pipe";

import { HomeListingsService } from "./homeListings.services";

@Controller('homeListings')
export class HomeListingsController {
    constructor(private readonly listingsService: HomeListingsService) { }

    @Get('homeproducts')
    async getProducts() {
        return await this.listingsService.getProducts();
    }

    

    }
