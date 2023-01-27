import {IsNotEmpty} from 'class-validator';

export class ListingDto{

    @IsNotEmpty()
    name: string;

    description: string;
    
    @IsNotEmpty()
    category: string;

    @IsNotEmpty()
    location: string;

}

// do all validation on fields here