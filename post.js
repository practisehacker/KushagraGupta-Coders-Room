const mongoose = require('mongoose');
//apne like ko refer nhi kiya in database?
// sir yha pr refer karna tha??
// maine nhi kia krna hain okk sir 5 min me karta hu then aap ko msg karta hu

const postSchema = new mongoose.Schema({
    content:{
        type:String,
        required: true
    },
    // user:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:'User'

    // }
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // include the array of ids of all comments in the post schema itself
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Comment'
        }
    ],  likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ]
},{
    timestamps: true,
});

///delete krke nya bnao
// bana lia mam
const Post= mongoose.model('Post',postSchema); 
module.exports = Post;
// mam actually ye user jo yha banaya hai upar he vo db me bhe visible nhi hai 
//working?
// no 
//is that user visible ein db?
// no mam in post it must be visible 
//wait okk