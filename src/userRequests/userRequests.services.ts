import { Model } from "mongoose";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Listing, listingDocument } from "../schemas/listing.schema";
import { User, userDocument } from "../schemas/user.schema";

@Injectable()
export class UserRequestsService {
    constructor(@InjectModel(Listing.name) private listingModel: Model<listingDocument>,
        @InjectModel(User.name) private userModel: Model<userDocument>) { }


    async getUserRequests(): Promise<any> {

        try {
            const uid = "1";
            var listingsDoc = await this.userModel.findById(uid, 'itemsRequested');
            if(!listingsDoc)
            throw new HttpException("User doesn't exists!", HttpStatus.NOT_FOUND);
           
            var listingsIds = listingsDoc.itemsRequested;
          
            //never use asyn/await with callbacks
            if (!listingsIds) 
            throw new HttpException('The user have not requested anything yet!', HttpStatus.NOT_FOUND);      
            else {
                var listings = [];

                for(const listingId of listingsIds)
                {
                    var listing = await this.listingModel.findById(listingId).lean();                   
                    listing['id'] = listing['_id'];                     
                    delete listing['_id'];        
                    listings.push(listing);
                }

                return listings;
            }
        }
        catch (error) {
            console.log(error);
            return error;
        }
    };

    async deleteRequest(listingID: string): Promise<any> {
        try {
            const uid = "1";
            const doc = await this.userModel.findByIdAndUpdate(uid, { $pull: { itemsRequested: listingID } });
            if (!doc) {
                throw new HttpException('No listing with given id present', HttpStatus.NOT_FOUND);
            }
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    async completeRequest(listingID: string): Promise<any> {
        const uid = "1";
        try {
            var dateTime = new Date(); 
            var date = dateTime.getDate();
            var time = dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds();
            const doc = await this.listingModel.updateOne({ _id: listingID },
                 {'status': 'shared', 
                 'sharedDate': date, 
                 'sharedTime': time });
                 
            if (!doc) {
                throw new HttpException('No listing with given id present', HttpStatus.NOT_FOUND);
            }
            else{
                console.log("listing updated: ", doc);
                return "Status of listing updated successfully!";
            }              
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

}

