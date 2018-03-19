const Post = require("../models/Post");

getTestPost = id => {
  Post.findById(id, function(err, post) {
    if (err) throw err;
  
    console.log(post);
  });
};

module.exports = getTestPost;