const Post = require("../modal/post");
const Comment = require("../modal/comment");
const Like = require('../modal/like');
module.exports.create = async function (req, res) {
  // console.log(req),
  try {
   let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });
    if(req.xhr){
        // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
        post = await post.populate('user', 'name').execPopulate();

      return res.status(200).json({
        data:{
          post:post,
        },
        message:"post Created!",
      });
    }
    req.flash('success', 'Post Creation Successful');
    return res.redirect("back");
  } catch (err) {
    req.flash('error', err);
    // added this to view the error on console as well
    console.log(err);
    return res.redirect('back');
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);
    if (post.user == req.user.id) {
       // CHANGE :: delete the associated likes for the post and all its comments' likes too
       await Like.deleteMany({likeable: post, onModel: 'Post'});
       await Like.deleteMany({_id: {$in: post.comments}});
      post.remove();

      await Comment.deleteMany({ post: req.params.id });
      if(req.xhr){
        return res.status(200).json({
          data:{
            post_id:req.params.id,
          },
          message: "Post Deleted"
        })
      }
      req.flash('success','Post And Asociated Comments Deleted');
      return res.redirect("back");
    } else {
      req.flash('error','You Cannot Delete These Posts');
      return res.redirect("back");
    }
  } catch (err) {
    req.flash('error', 'error');
    return res.redirect("back");
  }
};
