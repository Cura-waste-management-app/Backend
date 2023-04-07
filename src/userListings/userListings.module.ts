import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from '../schemas/user.schema';
import { Listing, listingSchema } from '../schemas/listing.schema';
import { UserListingsController } from './userListings.controller';
import { UserListingsService } from './userListings.services';
import { Location, locationSchema } from 'src/schemas/location.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Listing.name, schema: listingSchema },
    { name: User.name, schema: userSchema },
    { name: Location.name, schema: locationSchema }])],
    controllers: [UserListingsController],
    providers: [UserListingsService],
})
export class UserListingsModule { }
