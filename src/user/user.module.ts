import { Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import { User, userSchema } from '../schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.services';
import { Location, locationSchema } from 'src/schemas/location.schema';
import { UCI, uciSchema } from 'src/schemas/uciCode.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Location.name, schema: locationSchema }, 
    {name: User.name, schema: userSchema},
    {name: UCI.name, schema: uciSchema}])],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule { }
