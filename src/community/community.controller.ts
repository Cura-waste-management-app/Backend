import { Controller, Post, Body, Param, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityDto } from './dto/community.dto';
import { FileInterceptor } from '@nestjs/platform-express';
    
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
}
