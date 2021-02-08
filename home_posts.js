{
  // method to submit the form for new post using the ajax
  let createPost = function () {
    let newPostFrom = $("#new-post-form");

    newPostFrom.submit(function (e) {
      e.preventDefault();
      $.ajax({
        type: "POST",
        url: "/posts/create",
        data: newPostFrom.serialize(),
        success: function (data) {
          let newPost = newPostDom(data.data.post);
          $("#posts-list-container>ul").prepend(newPost);
          deletePost($(" .delete-post-button", newPost));
          // call the create comment class
          new PostComments(data.data.post._id);

          // CHANGE :: enable the functionality of the toggle like button on the new post
          new ToggleLike($(" .toggle-like-button", newPost));

          new Noty({
            theme: "relax",
            text: "Post published!",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };
  // method to create post in dom
  let newPostDom = function (post) {
    return $(`<li id="post-${post._id}">
    <p>
     
      <small>
        <a class="delete-post-button" href="/posts/destroy/${post._id}">❌</a>
      </small>
     
      ${post.content}
      <br>
      <small> ${post.user.name} </small>
      <br>
                        <small>
                            
                                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                                    0 Likes
                                </a>
                            
                        </small>
    </p>
    <div class="post-comments">
   
      <form id="post-${ post._id }-comments-form" action="/comments/create" method="POST">
        <input
          type="text"
          name="content"
          placeholder="Add comments"
          required
        />
        <input type="hidden" name="post" value="${post._id}" />
        <input type="submit" value="Add Comment" />
      </form>
      
      <div class="post-comments-list">
        <ul id="post-comments-${post._id}">
          
        </ul>
      </div>
    </div>
  </li>`);
  };

  // method to delete a post from fom
  let deletePost = function (deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();
      $.ajax({
        type: "GET",
        // to get the value of href defined in html
        url: $(deleteLink).prop("href"),
        success: function (data) {
          $(`#post-${data.data.post_id}`).remove();
          new Noty({
            theme: 'relax',
            text: "Post Deleted",
            type: 'success',
            layout: 'topRight',
            timeout: 1500
            
        }).show();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };
// loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
let convertPostsToAjax = function(){
  $('#posts-list-container>ul>li').each(function(){
      let self = $(this);
      let deleteButton = $(' .delete-post-button', self);
      deletePost(deleteButton);

      // get the post's id by splitting the id attribute
      let postId = self.prop('id').split("-")[1]
      new PostComments(postId);
  });
}



createPost();
convertPostsToAjax();
}
