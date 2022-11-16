const express = require("express");
const userControlers = require("../controlers/userControlers");
const { tryCatchWrapper } = require("../helpers/index");
const { userMiddlewares } = require("../middleweras/userMiddlewares");
const { upload } = require('../middleweras/uploadAvatars');
const userRouter = express.Router();


userRouter.post("/register", tryCatchWrapper(userControlers.register));
userRouter.post("/login", tryCatchWrapper(userControlers.login));
userRouter.post("/logout", tryCatchWrapper(userMiddlewares), tryCatchWrapper(userControlers.logout));
userRouter.get("/current", tryCatchWrapper(userMiddlewares), tryCatchWrapper(userControlers.current));
userRouter.patch("/avatars",  tryCatchWrapper(userMiddlewares),upload.single("image"), tryCatchWrapper(userControlers.avatars));


module.exports = {
  userRouter,
};

