const express = require("express");

const router = express.Router();

const { authCheck, adminCheck } = require("../middlewares/auth");

const {
  createOrUpdateUser,
  currentUser,
} = require("../controllers/authController");

//Create User
router.post("/create-or-update-user", authCheck, createOrUpdateUser);
//Retrieve the user || Login
router.post("/current-user", authCheck, currentUser);
//Admin check auth for user
router.post("/current-admin", authCheck, adminCheck, currentUser);

module.exports = router;
