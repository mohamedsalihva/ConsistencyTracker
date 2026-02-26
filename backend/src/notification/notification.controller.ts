import { Controller, Get,Req,UseGuards,ForbiddenException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { notificationService } from "./notification.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/users/users.schema";

@Controller('notification')
export class NotificationController{
         constructor(
            private readonly notificationService : notificationService,
            @InjectModel(User.name) private userModel: Model<User>,
         ) {}
 

         @UseGuards(AuthGuard('jwt'))
         @Get('my-history')
         async myHistory(@Req() req:any){
            const user= await this.userModel.findById(req.user.id);
            if(!user || user.role !== 'manager'){
                    throw new ForbiddenException('Only manager can access notification history');
            }
            return this.notificationService.getManagerHistory(user._id.toString());
         }

}