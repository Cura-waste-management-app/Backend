import { Model } from "mongoose";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ChatService {


    async getUserChats(): Promise<any> {

        try {
            const uid = "1";
            
           
        }
        catch (error) {
            console.log(error);
            return error;
        }
    };

  
 }

