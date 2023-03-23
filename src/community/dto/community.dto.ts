import { IsNotEmpty } from "class-validator";

export class CommunityDto
{
    @IsNotEmpty()
    name: string;
    
    @IsNotEmpty()
    description: string

    @IsNotEmpty()
    category: string

    @IsNotEmpty()
    location: string

    @IsNotEmpty()
    imgURL: string
    

    

}