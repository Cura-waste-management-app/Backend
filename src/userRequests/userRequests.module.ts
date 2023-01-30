import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from '../schemas/user.schema';
import { Listing, listingSchema } from '../schemas/listing.schema';
import { UserRequestsController } from './userRequests.controller';
import { UserRequestsService } from './userRequests.services';

@Module({
    imports: [MongooseModule.forFeature([{ name: Listing.name, schema: listingSchema },
    { name: User.name, schema: userSchema }])],
    controllers: [UserRequestsController],
    providers: [UserRequestsService],
})
export class UserRequestsModule { }
