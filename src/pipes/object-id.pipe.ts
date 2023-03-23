import { PipeTransform, Injectable} from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class ObjectIdPipe implements PipeTransform<string, mongoose.Types.ObjectId> {
  transform(value: string): mongoose.Types.ObjectId {
   
    return new mongoose.Types.ObjectId(value);
  }
}