import { Model, ObjectId } from "mongoose";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Listing, listingDocument } from "../schemas/listing.schema";
import { User, userDocument } from "../schemas/user.schema";
import { Location, locationDocument } from "src/schemas/location.schema";


@Injectable()
export class HomeListingsService {
    constructor(@InjectModel(Listing.name) private listingModel: Model<listingDocument>,
        @InjectModel(User.name) private userModel: Model<userDocument>,
        @InjectModel(Location.name) private locationModel: Model<locationDocument>,) { }

        async getProducts(uid: ObjectId): Promise<any>{
        
            try {
                // throw new HttpException('No user found', HttpStatus.NOT_FOUND);
                const user = await this.userModel.findById(uid).populate('location');
                if(!user){
                    throw new HttpException('No user found', HttpStatus.NOT_FOUND);
                }

                const listings = await this.listingModel.find({status: "Active", owner: {$ne: uid}}).populate('location').populate('owner', 'name avatarURL');
                if(!listings){
                    throw new HttpException('No listings found for user', HttpStatus.NOT_FOUND);
                }
                
                
                console.log(user);
                console.log(listings);
                return {listings,user};
            }
            catch (err) {
                console.log(err);
                return err;
            }
    
        }

        async getUserInfo(uid: ObjectId): Promise<any> {
            try{
                // throw new HttpException('No user found', 404);
                const user = await this.userModel.findById(uid).populate('itemsListed itemsRequested');
                
                if(!user){
                    throw new HttpException('No user found', HttpStatus.NOT_FOUND);
                }
                var lastmonthlisted = 0;
                var totallisted = user.itemsListed.length;
                var totalrequested = user.itemsRequested.length;
                var lastmonthrequested = 0;
                
                
                const current = new Date();
                

                for(var i=0;i<totallisted;i++){
                    const item = user.itemsListed[i];
                    const timeDifference=(Math.abs(current.valueOf()-item.postTimeStamp.valueOf()));
                    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
                    if(days<=30){
                        lastmonthlisted = lastmonthlisted + 1;
                    }
                }
                const data = {
                    name: user.name,
                    img: user.avatarURL,
                    totallisted : totallisted,
                    lastmonthlisted: lastmonthlisted,
                    points: user.points,
                }
                console.log(data);
                return data;

            }catch(err){
                console.log("Ye toh err nhi?");
                console.log(err);
                return err;
            }
        }

        // async addNewProduct(): Promise<any>{
        //     try {
        //         const listings = await this.listingModel.find({status: "Active", owner: {$ne: uid}}).populate('location').populate('owner', 'name');
                
        //         const user = await this.userModel.findById(uid);
        //         return {listings,user};
        //     }
        //     catch (err) {
        //         console.log(err);
        //         return err;
        //     }   
        // }
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
            const user = await this.userModel.findById(uid);
            if(!user){
                throw new HttpException('No user found', HttpStatus.NOT_FOUND);
            }
            const listing = await this.listingModel.findById(listingID);
            if(!listing){
                throw new HttpException('No listing found', HttpStatus.NOT_FOUND);
            }
            
            user.itemsLiked.map((item) => {
                if (item.toString() == listing._id.toString()) {

                    found = "true";
                }
            });


            if(found==="false"){
                user.itemsLiked.push(listing._id);
                listing.likes = listing.likes + 1;
            }else{
                user.itemsLiked = user.itemsLiked.filter((item)=>{
                    return item.toString()!==listing._id.toString();

                });
                listing.likes = listing.likes - 1;
            }
            await user.save();
            await listing.save();

            return {listing,user};

        }
        catch(err){

            console.log(err);
            return err;
        }
    }


    async toggleRequestStatus(listingID: ObjectId, uid: ObjectId): Promise<any>{
        
        try{
            var found = "false";
            const user = await this.userModel.findById(uid);
            if(!user){
                throw new HttpException('No user found', HttpStatus.NOT_FOUND);
            }
            const listing = await this.listingModel.findById(listingID);
            if(!listing){
                throw new HttpException('No listing found', HttpStatus.NOT_FOUND);
            }
            
            user.itemsRequested.map((item)=>{
                if(item.toString()==listing._id.toString()){
                    found = "true";
                }
            });

            if(found==="false"){
                user.itemsRequested.push(listing._id);
                listing.requestedUsers.push(user._id);
                listing.requests = listing.requests + 1;
            }else{
                user.itemsRequested = user.itemsRequested.filter((item)=>{
                    return item.toString()!==listing._id.toString();
                });
                listing.requestedUsers = listing.requestedUsers.filter((userji)=>{
                    return userji.toString()!==user._id.toString();
                })
                listing.requests = listing.requests - 1;
            }
            await user.save();
            await listing.save();
            return user;

        }
        catch(err){
            console.log(err);
            return err;
        }
    }

    

}

