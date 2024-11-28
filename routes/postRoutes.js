const router = require("express").Router();
const postControllers = require("../controllers/postController");
const { ensureAuthenticated } = require("../controllers/userController");

router.post("/create", ensureAuthenticated, postControllers.createPost);

router.get("/:post_id", ensureAuthenticated, postControllers.getpost);

router.get(
   "/allposts/:user_id",
   ensureAuthenticated,
   postControllers.getAllUserPosts
);

router.put("/edit/:post_id", ensureAuthenticated, postControllers.editPost);

router.delete(
   "/delete/:post_id",
   ensureAuthenticated,
   postControllers.deletePost
);

router.get("/likes/:post_id", ensureAuthenticated, postControllers.getAllLikes);

module.exports = router;
