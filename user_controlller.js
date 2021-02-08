const User = require('../modal/user');
const fs  = require('fs');
const path = require('path');
module.exports.profile = function(req, res){
    User.findById(req.params.id,function(err,user){
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        })
    })
 
}

module.exports.update =async function(req, res){
    // if(req.user.id== req.params.id){
    //     User.findByIdAndUpdate(req.params.id, req.body,function(err,user){
    //         return res.redirect('back')
    //     })
    // }else{
    //     return res.status(401).send('Unauthorized');
    // }
     if(req.user.id== req.params.id){
        try{
            let user =  await User.findById(req.params.id);
            User.uploadedAvatar(req,res, function(err){
                if(err){console.log("*****MUlter error Found",err)};
                // console.log(req.file);
                user.name = req.body.name;
                user.email = req.body.email;
                if(req.file){

                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar))
                    }
                    // this is saving the path of the uploaded file into the avayar field in the user
                    user.avatar = User.avatarPath+'/'+req.file.filename;

                }
                user.save();
                return res.redirect('back')
            });

        }catch(err){
            req.flash('error');
            return res.redirect('back');
        }


     }else{
         req.flash('error','unauthorized');
        return res.status(401).send('Unauthorized');
     }
}


// render the signUp page
module.exports.signUp = function(request, response){
    if(request.isAuthenticated()){
        return response.redirect('/users/profile');
    }

    return response.render('user_sign_up',{
        title: 'CODEIAL | Sign Up',
    });
}
// render the sign in page
module.exports.signIn = function(request, response){
    if(request.isAuthenticated()){
        return response.redirect('/users/profile');
    }
    return response.render('user_sign_in', {
        title: 'CODEIAL | Sign In',
    })
}
// get the signUp data 
module.exports.create = function(request,response){
   if(request.body.password != request.body.confirm_password){
       return response.redirect('back');
   }
   User.findOne({email:request.body.email},function(err,user){
       if(err){console.log("error in finding the user in Signing up");return;}
       if(!user){
           User.create(request.body,function(err,user){
            if(err){console.log("error in Creating user While Signing up");return;}
            return response.redirect('/users/sign-in');
           })
       }else{
           return response.redirect('back');
       }
    });
}
// signin and createSession
module.exports.createSession = function(request,response){
    request.flash('success','Logged In Successfully');
   return response.redirect('/');
}


module.exports.destroySession = function(request,response){
    request.flash('success','Logged Out Successfully');
    request.logout();
    
    
    return response.redirect('/');

}