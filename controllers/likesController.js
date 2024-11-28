const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const { accessTokenSecret } = require("../config");
const { connect } = require("../routes/userRoutes");

exports.addLike = async (req, res) => {
   try {
      const { target_type } = req.body;
      const { id } = req.params;

      const likeExists = await prisma.likes.findFirst({
         where: {
            user_id: req.user.id,
            target_id: +id,
         },
      });
      if (likeExists) {
         return res.status(422).json({ message: "A like already exists" });
      }
      if (target_type === "post" && !likeExists) {
         const postLike = await prisma.likes.create({
            data: {
               target_type,
               target_id: +id,
               post_id: +id,
               user_id: req.user.id,
            },
         });

         const old = await prisma.posts.findUnique({ where: { post_id: +id } });
         const amount = old.likes_count + 1;

         const updatePostlikes = await prisma.posts.update({
            where: { post_id: +id },
            data: { likes_count: amount },
         });
         return res.status(200).json({ message: "liked Post", postLike });
      } else if (target_type === "comment" && !likeExists) {
         const commentLike = await prisma.likes.create({
            data: {
               user: { connect: { user_id: req.user.id } },
               target_type,
               target_id: +id,
               comments: { connect: { comment_id: +id } },
            },
         });

         const old = await prisma.comments.findUnique({
            where: { comment_id: +id },
         });
         const amount = old.likes_count + 1;

         const updateCommentlikes = await prisma.comments.update({
            where: { comment_id: +id },
            data: { likes_count: amount },
         });

         return res.status(200).json({ message: "liked comment", commentLike });
      }
   } catch (error) {
      return res.status(500).json({ error: error.message });
      //   console.log(error);
   }
};

exports.deleteLike = async (req, res) => {
   try {
      const like = await prisma.likes.delete({
         where: {
            like_id: +req.params.like_id,
         },
      });
      if (like.target_type === "post") {
         const post = await prisma.posts.findUnique({
            where: {
               post_id: like.post_id,
            },
         });
         const current = post.likes_count - 1;

         const updatepostlikes = await prisma.posts.update({
            where: { post_id: like.post_id },
            data: { likes_count: current },
         });
      } else if (like.target_type === "comment") {
         const comment = await prisma.comments.findUnique({
            where: {
               comment_id: like.comment_id,
            },
         });

         const current = comment.likes_count - 1;

         const updateCommentLikes = await prisma.comments.update({
            where: {
               comment_id: like.comment_id,
            },
            data: {
               likes_count: current,
            },
         });
      }
      return res
         .status(200)
         .json({ message: "like removed successfully", like });
   } catch (error) {
      return res.status(500).json({ error: error.message });
      //   console.log(error);
   }
};
