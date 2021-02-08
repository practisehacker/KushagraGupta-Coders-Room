const passport=require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../modal/user');
// authentication using passport 
passport.use(new LocalStrategy({
    usernameField:'email',
    passReqToCallback:true
},
function (req,email,password,done){
    //  find the user and establish the identity
    User.findOne({email:email},function(err, user){
        if(err){
           req.flash('error',err);
            return done(err);
        }
        if( !user || user.password != password){
           req.flash('error','Invalid User or Password');
            return done(null,false);
        }
        return done(null,user);
    });
}

));
//  serializing the  user to decide which key is to be kept in the cookies
passport.serializeUser(function(user,done) {
    done(null,user.id);

})
// deserializing the user from the key in the cookies
passport.deserializeUser(function(id,done) {
User.findById(id,function(err,user){
    if(err){
        console.log("Error In Finding -->Passport")
            return done(err);
    }
    return done(null,user);
})
});

// sending data of the signed in user to the views
// step1 check weather user is authenticated 
passport.checkAuthentcation = function(req, res, next){
    // if user is signed in then pass on the request to the next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }
    // if user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(request, response , next){
    if(request.isAuthenticated()){
        // request.user contains the current signed in user from the session cookie and we are just sending it to the locals for the views

        response.locals.user = request.user;
    }
    next();
}

module.exports = passport;