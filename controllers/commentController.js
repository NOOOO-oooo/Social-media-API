const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const { accessTokenSecret } = require("../config");

exports.createComment = async (req, res) => {
   try {
      const { post_id } = req.params;
      const comment = await prisma.comments.create({
         data: {
            user: { connect: { user_id: +req.user.id } },
            posts: { connect: { post_id: +post_id } },
            data: req.body.data,
            likes_count: 0,
         },
      });

      return res.status(200).json({ message: "comment Created", comment });
   } catch (error) {
      return res.status(500).json({ error: error.message });
      //   console.log(error);
   }
};

exports.editComment = async (req, res) => {
   try {
      const commentexists = await prisma.comments.findUnique({
         where: {
            comment_id: +req.params.comment_id,
         },
      });

      if (!commentexists) {
         return res.status(404).json({ message: "comment not found" });
      }
      const edit = await prisma.comments.update({
         where: {
            comment_id: +req.params.comment_id,
         },
         data: {
            data: req.body.data,
         },
      });
      return res.status(200).json({ message: "comment has been edited" });
   } catch (error) {
      return res.status(500).json({ error: error.message });
      //   console.log(error);
   }
};

exports.deleteComment = async (req, res) => {
   try {
      const commentexists = await prisma.comments.findUnique({
         where: {
            comment_id: +req.params.comment_id,
         },
      });
      if (!commentexists) {
         return res.status(404).json({ message: "comment not found" });
      }

      const comment = await prisma.comments.delete({
         where: {
            comment_id: req.params.comment_id,
         },
      });

      return res.status(200).json({ message: "Comment has been deleted" });
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
};

exports.AlluserCommentsonPost = async (req, res) => {
   try {
      const comments = await prisma.comments.findMany({
         where: {
            user_id: req.user.id,
            post_id: +req.params.post_id,
         },
      });

      if (!comments) {
         return res.status(404).json({
            message: "no comments were made by this user on this post",
         });
      }

      return res.status(200).json({
         message: "comments made on this posts by this user are",
         comments,
      });
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
};

exports.getAllPostComments = async (req, res) => {
   try {
      const comments = await prisma.comments.findMany({
         where: {
            post_id: +req.params.post_id,
         },
      });

      if (!comments) {
         return res
            .status(404)
            .json({ message: "no comments were made in this post" });
      }

      return res.status(200).json(comments);
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
};
