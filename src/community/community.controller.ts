import { Controller, Post, Body, Param,Get, Query, Delete } from '@nestjs/common';
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

    @Get('getcommunitybyuserid/:userId')
    async getCommunityByUserId(
        @Param('userId') userId: string
    )
    {
        return await this.communityService.getCommunitiesByUserId(userId);
    }

    @Get('getcommunitybyid/:id')
    async getCommunityById(
        @Param('id') id: string
    )
    {
        return await this.communityService.getCommunitiesById(id);
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

    @Delete('leavecommunity/:communityId/:userId')
    async leaveEventByUserId(
        @Param('communityId') communityId: ObjectId,
        @Param('userId') userId: string,
   
    ) 
    {
        return await this.communityService.leaveCommunity(communityId, userId);
        
    }


    @Delete('deletecommunity/:communityId/:userId')
    async deleteCommunity(
        @Param('communityId') communityId: ObjectId,
        @Param('userId') userId: string

    ) {
        return await this.communityService.deleteCommunityById(communityId, userId)

        
    }

    @Post('updatecommunity/:communityId')
    async updateUser( @Param('communityId') communityId: ObjectId,@Body() dto: CommunityDto) {
        console.log(dto);
        return await this.communityService.updateCommunity(communityId,dto);
    }



    

    @Get('checkifthememberexist/:communityId/:userId')
    async checkifthememberexist(
        @Param('communityId') communityId: ObjectId,
        @Param('userId') userId: string,
    ) 
    {
        return await this.communityService.checkIfTheUserExistCommunity(communityId, userId)
        
    }


    @Get('getusersbycommunity/:communityId')
    async getusersbycommuntiy(
        @Param('communityId') communityId: ObjectId
    )
    {
        return await this.communityService.getUsersByCommunity(communityId);


    }
}
