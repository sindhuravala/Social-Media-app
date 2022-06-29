const express = require("express");
const Post = require('../models/post'); //accesses functions in user model file
const router = express.Router();

// 2. create all routes to access database
router
  .post('/SeePost', async (req, res) => {
    try {
      const post = await Post.SeePost(req.body.postid);
      res.send({...post});
    } catch(error) {
      res.status(401).send({ message: error.message });
    }
  })

  .post('/CreatePost', async (req, res) => {
    try {
      const post = await Post.CreatePost(req.body.postId, req.body.postcontent, req.body.adminId);
      res.send({...post, postid: undefined});
    } catch(error) {
      res.status(401).send({ message: error.message }); 
    }
  })

  .put('/updatePost', async (req, res) => {
    try {
      const post = await Post.updatePost(req.body.postId, req.body.postcontent);
      res.send({...post, postid: undefined});
    } catch(error) {
      res.status(401).send({ message: error.message });
    }
  })

  .delete('/deletePost', async (req, res) => {
    try {
      await Post.deletePost(req.body.postid);
      res.send({ success: "Post deleted" });
    } catch(error) {
      res.status(401).send({ message: error.message });
    }
  })

// 3. export router for use in index.js
module.exports = router;