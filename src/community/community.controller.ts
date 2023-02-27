import { Controller, Post, Body, Param, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Get, Query } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityDto } from './dto/community.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ObjectId } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { get } from 'http';
    
@Controller('community')
export class CommunityController {

    constructor(private readonly communityService: CommunityService){

    }

    @Post('createCommunity/:adminId')
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
    async getCommunityByName(
        @Param('category') category: string
    )
    {
        return await this.communityService.getCommunitiesByCategory(category);
    }
}
