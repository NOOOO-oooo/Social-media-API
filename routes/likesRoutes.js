const router = require("express").Router();

const likesController = require("../controllers/likesController");

const { ensureAuthenticated } = require("../controllers/userController");

router.post("/add/:id", ensureAuthenticated, likesController.addLike);
router.delete(
   "/delete/:like_id",
   ensureAuthenticated,
   likesController.deleteLike
);
module.exports = router;
