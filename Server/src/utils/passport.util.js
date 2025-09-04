import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";

const passportGoogleAuth = (app, PORT) => {
    app.use(passport.initialize());
    
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: `http://localhost:${PORT}/api/auth/google/callback`,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const email = profile.emails[0].value;

                    //Check if user exists
                    let user = await User.findOne({ email });

                    if(!user) {
                        // Create new user
                        user = new User({
                            fullName: profile.displayName,
                            email: email,
                            googleId: profile.id,
                        });
                        await user.save();
                    }

                    console.log("Google profile:", user);
                    done(null, user);
                } catch (error) {
                    done(error, null);
                }
            }
        )
    );

    // passport.serializeUser((user, done) => {
    //     done(null, user.id);
    // });

    // passport.deserializeUser(async (id, done) => {
    //     try {
    //         const user = await User.findById(id);
    //         done(null, user);
    //     } catch (error) {
    //         done(error, null);
    //     }
    // });
}

export default passportGoogleAuth;   