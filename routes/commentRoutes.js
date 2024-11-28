const router = require("express").Router();
const { ensureAuthenticated } = require("../controllers/userController");
const CommentsControllers = require("../controllers/commentController");

router.post(
   "/create/:post_id",
   ensureAuthenticated,
   CommentsControllers.createComment
);

router.put(
   "/edit/:comment_id",
   ensureAuthenticated,
   CommentsControllers.editComment
);

router.delete(
   "/delete/:comment_id",
   ensureAuthenticated,
   CommentsControllers.deleteComment
);

router.get(
   "/user/:post_id",
   ensureAuthenticated,
   CommentsControllers.AlluserCommentsonPost
);

router.get(
   "/:post_id",
   ensureAuthenticated,
   CommentsControllers.getAllPostComments
);

module.exports = router;
