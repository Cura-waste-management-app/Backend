import { Controller, Post, Body, Param,Get, Query } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityDto } from './dto/community.dto';
import { ObjectId } from 'mongoose';

    
@Controller('community')
export class CommunityController {

    constructor(private readonly communityService: CommunityService){

    }

    @Post('createcommunity/:adminId')
    //@UseInterceptors(FileInterceptor('file'))
    async createCommunity(
        @Body() dto: CommunityDto,
        @Param('adminId') adminId: string,
   
        )
        {
            const community = await this.communityService.addNewCommunity(dto, adminId);
            return {community};
            

        }

    @Get('allcommunities')

    async getCommunities(@Query('offset') offset = 0, @Query('limit') limit = 10) {
        return this.communityService.getallCommunities(offset,limit);

        
    }

    @Post('joincommunity/:userId/:communityId')
    async joinCommunity(

        @Param('userId') userId: string,
        @Param('communityId') communityId: ObjectId,
    )
    {
    console.log(userId," in controller ");
    return await this.communityService.joinCommunity(userId,communityId)

    }

    @Get('getcommunitybyid/:userId')
    async getCommunityById(
        @Param('userId') userId: string
    )
    {
        return await this.communityService.getCommunitiesByUserId(userId);
    }

    @Get('getcommunitybycategory/:category')
    async getCommunityByCategory(
        @Param('category') category: string
    )
    {
        return await this.communityService.getCommunitiesByCategory(category);
    }

    @Get('getcommunitybyname/:name')
    async getCommunityByName(
        @Param('name') name: string
    )
    {
        return await this.communityService.getCommunitiesByName(name);
    }


    

    @Get('getusersbycommunity/:communityId')
    async getusersbycommuntiy(
        @Param('communityId') communityId: ObjectId
    )
    {
        return await this.communityService.getUsersByCommunity(communityId);


    }
}
