const Coupon = require("../models/couponModel");

const create = async (req, res, next) => {
  try {
    const { name, expiry, discount } = req.body.coupon;
    console.log(name, expiry, discount);

    res.status(201).json(await new Coupon({ name, expiry, discount }).save());
  } catch (error) {
    console.log(error);
  }
};
const list = async (req, res, next) => {
  try {
    res.status(201).json(await Coupon.find({}).sort({ createdAt: -1 }).exec());
  } catch (error) {
    console.log(error);
  }
};
const remove = async (req, res, next) => {
  console.log("Hi");
  try {
    res
      .status(201)
      .json(await Coupon.findByIdAndDelete(req.params.couponId).exec());
  } catch (error) {
    console.log(error);
  }
};

module.exports = { create, list, remove };
