const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const { accessTokenSecret } = require("../config");
const { post } = require("../routes/userRoutes");

exports.createPost = async (req, res) => {
   try {
      const headerAccessToken = req.headers.authorization;
      const decodedAccessToken = await jwt.decode(
         headerAccessToken,
         accessTokenSecret
      );
      const postdata = await prisma.posts.create({
         data: {
            data: req.body.data,
            user_id: parseInt(decodedAccessToken.user_id),
            likes_count: 0,
         },
      });

      if (!req.body.data) {
         return res
            .status(401)
            .json({ message: "enter the data for the post" });
      }
      return res
         .status(200)
         .json({ message: "post created Succefully", postdata });
   } catch (error) {
      return res.status(500).json({ error: error.message });
      //   console.log(error);
   }
};

exports.editPost = async (req, res) => {
   try {
      const newdata = await prisma.posts.update({
         where: {
            post_id: parseInt(req.params.post_id),
         },
         data: {
            data: req.body.data,
         },
      });
      if (!req.body.data) {
         return res.status(401).json({ message: "please enter the new data." });
      }
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
};

exports.getpost = async (req, res) => {
   try {
      if (!req.params.post_id) {
         return res.status(401).json({ error: "Please enter the post id" });
      }

      const post = await prisma.posts.findUnique({
         where: {
            post_id: parseInt(req.params.post_id),
         },
      });

      if (!post) {
         return res.status(401).json({ error: "Please enter a valid post id" });
      }

      return res.status(200).json(post);
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
};

exports.getAllUserPosts = async (req, res) => {
   try {
      const posts = await prisma.posts.findMany({
         where: {
            user_id: parseInt(req.params.user_id),
         },
      });
      if (!req.params.user_id) {
         return res.status(401).json({ message: "please enter a user id" });
      }
      return res.status(200).json(posts);
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
};

exports.deletePost = async (req, res) => {
   try {
      if (!req.params.post_id) {
         return res.status(401).json({ message: "enter the post Id" });
      }

      const findPost = await prisma.posts.findUnique({
         where: {
            post_id: req.params.post_id,
         },
      });

      if (!findPost) {
         return res.status(422).json({ message: "Post not found" });
      }
      const targetPost = await prisma.posts.delete({
         where: {
            post_id: req.params.post_id,
         },
      });

      const sanitizedtargetPost = {
         ...findPost,
         user_id: parseInt(findPost.user_id),
         post_id: parseInt(findPost.post_id),
      };

      return res
         .status(200)
         .json({ message: "post deleted Successfully", sanitizedtargetPost });
   } catch (error) {
      return res.status(500).json({ error: error.message });
      //   console.log(error);
   }
};

exports.getAllLikes = async (req, res) => {
   try {
      const likes = await prisma.likes.findMany({
         where: {
            post_id: +req.params.post_id,
         },
      });
      const amount = likes.length;
      res.status(200).json({ message: "total likes", amount });
   } catch (error) {
      return res.status(500).json({ error: error.message });
      //   console.log(error);
   }
};
