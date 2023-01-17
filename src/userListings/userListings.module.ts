import { Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import { userListings, userListingsSchema } from 'src/schemas/userLlistings.schema';
import { Listing, listingSchema } from '../schemas/listing.schema';
import { UserListingsController } from './userListings.controller';
import { UserListingsService } from './userListings.services';

@Module({
    imports: [MongooseModule.forFeature([{ name: Listing.name, schema: listingSchema }, 
    {name: userListings.name, schema: userListingsSchema}])],
    controllers: [UserListingsController],
    providers: [UserListingsService],
})
export class UserListingsModule { }
