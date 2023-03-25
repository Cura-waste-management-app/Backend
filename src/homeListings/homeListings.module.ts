import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from '../schemas/user.schema';
import { Listing, listingSchema } from '../schemas/listing.schema';
import { HomeListingsController } from './homeListings.controller';
import { HomeListingsService } from './homeListings.services';

@Module({
    imports: [MongooseModule.forFeature([{ name: Listing.name, schema: listingSchema },
    { name: User.name, schema: userSchema }])],
    controllers: [HomeListingsController],
    providers: [HomeListingsService],
})
export class HomeListingsModule { }
