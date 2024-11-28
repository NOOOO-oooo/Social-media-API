const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { accessTokenSecret } = require("../config");

exports.addFriend = async (req, res) => {
   try {
      const findUser = await prisma.users.findUnique({
         where: {
            user_id: +req.params.target_id,
         },
      });
      if (!req.params.target_id) {
         return res.status(401).json({ message: "enter the id " });
      }
      if (!findUser) {
         return res
            .status(404)
            .json({ message: "Psst, there is not such user" });
      }

      const found = await prisma.friends.findFirst({
         where: {
            user_id: req.user.id,
            target_id: +req.params.target_id,
         },
      });

      if (found) {
         return res
            .status(422)
            .json({ message: "You are already friends with this user" });
      }

      const friend = await prisma.friends.create({
         data: {
            user_id: +req.user.id,
            target_id: +req.params.target_id,
         },
      });
      return res
         .status(200)
         .json({ message: "friend added successfully", friend });
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
};

exports.deleteFriend = async (req, res) => {
   try {
      const friendexists = await prisma.friends.findUnique({
         where: { relation_id: +req.params.relation_id },
      });

      if (!friendexists) {
         return res.status(404).json({ message: "There is no such Friend" });
      }

      const delRelation = await prisma.friends.delete({
         where: {
            relation_id: +req.params.relation_id,
            user_id: req.user.id,
            target_id: friendexists.target_id,
         },
      });

      return res
         .status(200)
         .json({ message: "Friendship deleted successfully", delRelation });
   } catch (error) {
      //   return res.status(500).json({ error: error.message });
      console.log(error);
   }
};
