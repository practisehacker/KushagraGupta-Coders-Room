const Comment = require("../modal/comment");
const Post = require("../modal/post");
const commentsMailer = require("../mailers/comments_mailer");
const commentEmailWorker = require("../workers/comment_email_worker");
const queue = require("../config/kue");
const Like = require('../modal/like');
// module.exports.create =async function(req, res){
//     let post = await Post.findById(req.body.post);
//     try{

//         if(post){
//          let comment =   Comment.create({
//                 content: req.body.content,
//                 post:req.body.post,
//                 user: req.user._id,

//             },

//             function(err,comment){
//                // if(err){console.log("error in creating comment",err); return;}
//                post.comments.push(comment);
//                post.save();
//                req.flash('success','Comment Created!');
//                if(req.xhr){
//                 return res.status(200).json({
//                     data:{
//                         comment:comment,
//                     },
//                     message:"Comment CReated!"

//                 })
//             }
//                res.redirect('/')
//             });

//            }
//     }catch (err) {
//         req.flash('error','Error Found');
//         return res.redirect('/');
//     }

// }
module.exports.create = async function (req, res) {
  try {
    let post = await Post.findById(req.body.post);

    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });

      post.comments.push(comment);
      post.save();

      comment = await comment.populate("user", "name email").execPopulate();
      // commentsMailer.newComment(comment);
      let job = queue.create("emails", comment).save(function (err) {
        if (err) {
          console.log("error in sending to queue", err);
          return;
        }
        console.log("Job Enqued", job.id);
      });
      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment: comment,
          },
          message: "Post created!",
        });
      }

      req.flash("success", "Comment published!");

      res.redirect("/");
    }
  } catch (err) {
    req.flash("error", err);
    return;
  }
};

// module.exports.destroy = function (req, res) {
//   Comment.findById(req.params.id, function (err, comment) {
//     if (comment.user == req.user.id) {
//       let postId = comment.post;
//       comment.remove();
//       req.flash("success", "Comment Deleted!");
//       Post.findByIdAndUpdate(
//         postId,
//         { $pull: { comments: req.params.id } },
//         function (err, post) {
//           return res.redirect("back");
//         }
//       );
//     } else {
//       return res.redirect("back");
//     }
//   });
// };
module.exports.destroy = async function(req, res){

    try{
        let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id){

            let postId = comment.post;

            comment.remove();

            let post = Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});

            // CHANGE :: destroy the associated likes for this comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});


            // send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }


            req.flash('success', 'Comment deleted!');

            return res.redirect('back');
        }else{
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        return;
    }
    
}