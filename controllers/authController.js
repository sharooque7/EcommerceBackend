const User = require("../models/userModel");

const createOrUpdateUser = async (req, res, next) => {
  const { name, picture, email } = req.user;

  const user = await User.findOneAndUpdate(
    { email: email },
    { name: email.split("@")[0], picture },
    { new: true }
  );

  if (user) {
    console.log("User updated", user);
    res.json(user);
  } else {
    const newUser = await new User({
      email,
      name: email.split("@")[0],
      picture,
    }).save();
    console.log("User created", newUser);
    res.json(newUser);
  }
};

//get user from DB
const currentUser = async (req, res, next) => {
  const { email } = req.user;
  await User.findOne({ email: email }).exec((err, user) => {
    if (err) {
      throw new Error(err);
    }
    res.json(user);
  });
};

module.exports = { createOrUpdateUser, currentUser };
