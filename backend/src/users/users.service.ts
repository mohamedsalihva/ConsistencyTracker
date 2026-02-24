import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
    ){}

    findByEmail(email: string){
        return this.userModel.findOne({email});
    }
    findById(id:string){
        return this.userModel.findById(id);
    }
    create(data: any){
        return this.userModel.create(data);
    }

    updateById(id: string, data: any){
        return this.userModel.findByIdAndUpdate(id,data,{new:true});
    }
}
