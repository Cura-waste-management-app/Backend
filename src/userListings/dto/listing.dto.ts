import {IsNotEmpty} from 'class-validator';


export class ListingDto{

    @IsNotEmpty()
    ownerID: string;

    @IsNotEmpty()
    title: string;
    
    description: string;
    
    @IsNotEmpty()
    category: string;

    @IsNotEmpty()
    location: string;

    @IsNotEmpty()
    imagePath: string

}

// do all validation on fields here