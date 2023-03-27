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
                const user = await this.userModel.findById(uid);
                return {listings,user};
            }
            catch (err) {
                console.log(err);
                return err;
            }
    
        }
    // async getProducts(uid: ObjectId): Promise<any> {

    //     try {
    //         const listings = await this.listingModel.find({ status: "Active", owner: { $ne: uid } });
    //         const user = await this.userModel.findById(uid, 'itemsLiked itemsRequested');
    //         // return [listings, user.itemsLiked, user.itemsRequested];
    //         return {
    //             listings: listings,
    //             itemsLiked: user.itemsLiked,
    //             itemsRequested: user.itemsRequested
    //         };

    //     }
    //     catch (err) {
    //         console.log(err);
    //         return err;
    //     }

    // }


    async toggleLikeStatus(listingID: ObjectId, uid: ObjectId): Promise<any> {

        try {
            var found = "false";

            const listing = await this.listingModel.findById(listingID);
            const user = await this.userModel.findById(uid);
            user.itemsLiked.map((item) => {
                if (item.toString() == listing._id.toString()) {
                    found = "true";
                }
            });

            if (found === "false") {
                user.itemsLiked.push(listing._id);
                listing.likes = +listing.likes + Number(1);
            } else {
                user.itemsLiked = user.itemsLiked.filter((item) => {
                    return item.toString() !== listing._id.toString();
                });
                listing.likes = +listing.likes - Number(1);
            }
            await user.save();
            await listing.save();
            return { listing, user };

        }
        catch (err) {
            console.log(err);
            return err;
        }
    }


}

