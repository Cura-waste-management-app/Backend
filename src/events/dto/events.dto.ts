import { IsNotEmpty } from "class-validator";

export class EventsDto
{
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    description: string

    @IsNotEmpty()
    location: string

    @IsNotEmpty()
    imageURL: string
}