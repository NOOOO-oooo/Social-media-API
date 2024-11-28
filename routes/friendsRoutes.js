const router = require("express").Router();
const { ensureAuthenticated } = require("../controllers/userController");
const friendsControllers = require("../controllers/friendsController");

router.post(
   "/add/:target_id",
   ensureAuthenticated,
   friendsControllers.addFriend
);

router.delete(
   "/delete/:relation_id",
   ensureAuthenticated,
   friendsControllers.deleteFriend
);

router.get("/all", ensureAuthenticated, friendsControllers.getAllFriends);

module.exports = router;
