const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const config = require("../config");

const signupSchema = Joi.object({
   email: Joi.string().email().required(),
   password: Joi.string().min(6).required(),
   name: Joi.string().required(),
});

exports.signup = async (req, res) => {
   try {
      const { error, value } = signupSchema.validate(req.body, {
         abortEarly: false,
      });

      if (error) {
         return res.status(401).json({ error: error.details.message });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const createUser = await prisma.users.create({
         data: {
            email: req.body.email,
            password: hashedPassword,
            name: req.body.name,
         },
      });

      createUser.user_id = parseInt(createUser.user_id);
      return res.status(200).json(createUser);
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
};

exports.signin = async (req, res) => {
   try {
      const validEmail = await prisma.users.findUnique({
         where: {
            email: req.body.email,
         },
      });

      if (!validEmail) {
         return res.status(400).json({ error: "invalid email or password" });
      }

      const validPassword = await bcrypt.compare(
         req.body.password,
         validEmail.password
      );

      if (!validPassword) {
         return res.status(400).json({ error: "invalid email or password" });
      }

      const accessToken = await jwt.sign(
         { user_id: parseInt(validEmail.user_id) },
         config.accessTokenSecret,
         { subject: "signIn", expiresIn: "3h" }
      );

      return res
         .status(200)
         .json({ message: "Signed in Successfully", accessToken });
   } catch (error) {
      //   return res.status(500).json({ error: error.message });
      console.log(error);
   }
};

exports.updateEmail = async (req, res) => {
   try {
      const newUserEmail = await prisma.users.update({
         where: {
            user_id: parseInt(req.params.user_id),
         },
         data: {
            email: req.body.email,
         },
      });
      newUserEmail.user_id = newUserEmail.user_id.toString();
      return res
         .status(200)
         .json({ message: "email updated successfully", newUserEmail });
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
};

exports.changePassword = async (req, res) => {
   try {
      const { oldPassword, password } = req.body;
      const user = await prisma.users.findUnique({
         where: {
            email: req.body.email,
         },
      });
      if (!user || !oldPassword || !password) {
         return res.status(400).json({
            error: "Email, old password, and new password are required.",
         });
      }

      const oldPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!oldPasswordValid) {
         return res.status(401).json({ message: "old password is Invalid" });
      }

      hashedNewPassword = await bcrypt.hash(password, 10);

      const updatedPassword = await prisma.users.update({
         where: {
            email: user.email,
         },
         data: {
            password: hashedNewPassword,
         },
      });

      return res.status(200).json({ message: "Password updated successfully" });
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
};

exports.ensureAuthenticated = async (req, res, next) => {
   const headerAccessToken = req.headers.authorization;

   if (!headerAccessToken) {
      return res.status(401).json({ message: "Access Token Not Found" });
   }

   try {
      const decodedAccessToken = await jwt.verify(
         headerAccessToken,
         config.accessTokenSecret
      );

      req.user = { id: decodedAccessToken.user_id };
      next();
   } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
         res.status(401).json({ error: "Invalid token" });
      } else if (error instanceof jwt.TokenExpiredError) {
         res.status(401).json({ error: "Token Expired" });
      } else {
         res.status(500).json({ error: error.message });
      }
   }
};
