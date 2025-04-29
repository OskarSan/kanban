// Code to configure Google OAuth2.0 with passport.js
// Code made by Erno Vanhala: https://github.com/Gessle/awa-google-auth/blob/main/src/middleware/google-passport-config.ts


import passport from 'passport';
import { Strategy, Profile} from 'passport-google-oauth20';
import dotenv from 'dotenv';
dotenv.config()

passport.use(new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: process.env.GOOGLE_CALLBACK_URL as string
},(accessToken: string, refreshToken: string, profile: Profile, done) => {
    console.log("accessToken: ", accessToken);
    console.log("refreshToken: ", refreshToken);
    console.log("profile: ", profile);
    return done(null, profile);
}));


export default passport