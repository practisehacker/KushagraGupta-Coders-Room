const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../modal/user');

// for using new google statergy for google login
passport.use(new googleStrategy({
    clientID: '529445086078-9jo2d3nelqqh584eotc81g89oi0n77oj.apps.googleusercontent.com',
    clientSecret: 'd_wTliizJJyMiEEBThXlTQTL',
    callbackURL:'http://localhost:7000/users/auth/google/callback'
},
function(accessToken,refreshToken,profile,done) {
    // find a user 
    User.findOne({email:profile.emails[0].value}).exec(function(err,user) {
        if(err){console.log("error in google statergy",err);return;}

        console.log(profile);

        if(user){
            // if found set these user as request.user
            return done(null,user);
        }else{
            // if not found ,create the user and set it as request.user
            User.create({name:profile.displayName,
            email:profile.emails[0].value,
            password:crypto.randomBytes(20).toString('hex'),
        },function(err,user){
            if(err){console.log("error in Creating User google statergy",err);return;}

            return done(null,user);
        })
        }
    })

}

))

module.exports =passport;