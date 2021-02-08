const Post = require("../modal/post");
const User = require("../modal/user");
module.exports.home = async function (request, response) {
  // return response.end('<h1>Express server is running for codieal</h1>');
  // console.log(request.cookies);
  // response.cookie('user_id',25);

  // Post.find({},function(err,posts){

  // });
  // populate the user of each post

  try {
    let posts = await Post.find({})
      .sort('-createdAt')
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
        populate: {
          path: 'likes'
      }
      }).populate('comments')
      .populate('likes');
    let users = await User.find({});

    return response.render("home", {
      title: "Codial | Home",
      posts: posts,
      all_users: users,
    });
  } catch (err) {
    console.log("Error Found".err);
    return;
  }
};
