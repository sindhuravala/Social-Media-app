// 1. import mongoose
const mongoose = require("mongoose");

// 2. create schema for entity
const postSchema = new mongoose.Schema({
  post_id: { type: String, unique: true, required: true},
  post_content: { type: String, required: true},
  post_delete: {type: String},
  admin_id:{ type: String, required: true} 
})

// 3. create model of schema
const Post = mongoose.model("Post", postSchema);

// 4. create CRUD functions on model
//CREATE a user
async function CreatePost(postid, postcontent, adminid) {
    const newPost = await Post.create({
    post_id: postid,
    post_content: postcontent,
    admin_id: adminid
  });

  return newPost;
}

// READ a user
async function SeePost(postid) {
  return await Post.findOne({"post_id":postid});
}

// UPDATE
async function updatePost(id, postcontent) {
  const post = await Post.updateOne({"post_id": id}, {$set: { post_content: postcontent}});
  return post;
}

//DELETE
async function deletePost(id) {
  await Post.deleteOne({"post_id": id});
};

// utility functions
async function getPost(adminid) {
  return await Post.findOne({ "admin_id":adminid});
}

// 5. export all functions we want to access in route files
module.exports = { 
  CreatePost,  updatePost, deletePost, getPost, SeePost
};