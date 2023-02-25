import { Module } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Community, CommunitySchema } from 'src/schemas/community.schema';
import { User, userSchema } from 'src/schemas/user.schema';

@Module({
  imports:  [ MongooseModule.forFeature([{name: Community.name, schema:CommunitySchema }, {name: User.name, schema: userSchema}])],
  providers: [CommunityService],
  controllers: [CommunityController]
})
export class CommunityModule {}
