import { Model, ObjectId } from "mongoose";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Listing, listingDocument } from "../schemas/listing.schema";
import { User, userDocument } from "../schemas/user.schema";


@Injectable()
export class HomeListingsService {
    constructor(@InjectModel(Listing.name) private listingModel: Model<listingDocument>,
        @InjectModel(User.name) private userModel: Model<userDocument>) { }

    async getProducts(uid: ObjectId): Promise<any>{
        
        try {
            const listings = await this.listingModel.find({status: "Active", owner: {$ne: uid}});

            return listings;
        }
        catch (err) {
            console.log(err);
            return err;
        }

    }

    
}

