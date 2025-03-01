import passport from 'passport';
import { Strategy, Profile} from 'passport-google-oauth20';

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