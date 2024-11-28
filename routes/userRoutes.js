const router = require("express").Router();
const userControllers = require("../controllers/userController");

router.post("/signup", userControllers.signup);
router.get("/signin", userControllers.signin);
router.put(
   "/email/:user_id",
   userControllers.ensureAuthenticated,
   userControllers.updateEmail
);
router.put(
   "/password",
   userControllers.ensureAuthenticated,
   userControllers.changePassword
);
module.exports = router;
