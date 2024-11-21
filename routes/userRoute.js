const express = require("express");
const { userRegister, userLogin, logout, getMyProfile, changePassword, updateProfile, addToplayList, deletePlayList } = require("../controllers/userController");
const {isAuthenticated} = require("../middleware/auth");
const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/logout", logout);
router.get("/my-profile", isAuthenticated, getMyProfile);
router.put("/change-password", isAuthenticated, changePassword);
router.put("/update-profile", isAuthenticated, updateProfile);


router.post("/add-to-playlist", isAuthenticated, addToplayList);
router.delete("/delete-playlist", isAuthenticated, deletePlayList);





module.exports = router