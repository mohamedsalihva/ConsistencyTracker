import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google'){
     constructor () {
        super({
             clientID: process.env.GOOGLE_CLIENT_ID!,
             clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
             callbackURL: process.env.GOOGLE_CALLBACK_URL!,
             scope: ['email', 'profile'],
        });
     }

     async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback){
        const {id, displayName, emails, photos}=profile;
        const primaryEmail = emails?.[0];
        const email = primaryEmail?.value;
        const isVerified = primaryEmail?.verified !== false;

        if (!email || !isVerified) {
            return done(new UnauthorizedException('Google account email is missing or not verified'), false);
        }

        const user ={
            googleId: id,
            email,
            name:displayName,
            avatar: photos?.[0]?.value ?? null,
        };
        done(null, user);
     }
}
