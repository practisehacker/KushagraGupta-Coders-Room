const User =  require('../../../modal/user');
const jwt =require('jsonwebtoken'); 

module.exports.createSession =async function(req, res){
    try {
        let user =await  User.findOne({email:req.body.email});
        if(!user|| user.password!= req.body.password){
            return res.json(422,{
                message:"Invalid Username or password"
            })
        }
        return res.json(200,{
            message:"Signed In Successful, here is your token keep it safe",
            data:{
                token: jwt.sign(user.toJSON(),'codeial',{expiresIn:'100000'})
                // jwt sign is function for genrating the token
        }
        })

    
    }catch (err) {
        console.log("*********",err);
        return res.json(500,{
            message:"Internal Server Error",
        })
    }
 


}