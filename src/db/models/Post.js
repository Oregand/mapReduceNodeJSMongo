// grab the things we need
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create a schema
const postSchema = new Schema({
  Id: Number,
  PostTypeId: Number,
  AcceptedAnswerId: Number,
  ParentId: String,
  CreationDate: String,
  DeletionDate: String,
  Score: Number,
  ViewCount: Number,
  Body: String,
  OwnerUserId: Number,
  OwnerDisplayName: String,
  LastEditorUserId: String,
  LastEditorDisplayName: String,
  LastEditDate: String,
  LastActivityDate: String,
  Title: String,
  Tags: String,
  AnswerCount: Number,
  CommentCount: Number,
  FavoriteCount: Number,
  ClosedDate: String,
  CommunityOwnedDate: String
});

postSchema.index({ Body: "text" });

// Create post model for mapReduce useage
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
