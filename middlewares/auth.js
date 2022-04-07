const admin = require("../firebase");
const User = require("../models/userModel");

const authCheck = async (req, res, next) => {
  console.log(" sharooque------------------", req.headers.authtoken);
  console.log("Hi");
  try {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);
    console.log("Firebase user in auth check ", firebaseUser);
    req.user = firebaseUser;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      err: "Invalid or expired token",
    });
  }
};

const adminCheck = async (req, res, next) => {
  const { email } = req.user;

  const adminUser = await User.findOne({ email }).exec();

  if (adminUser.role !== "admin") {
    res.status(403).json({ error: "Admin resource. Access denied" });
  } else {
    next();
  }
};

module.exports = { authCheck, adminCheck };
