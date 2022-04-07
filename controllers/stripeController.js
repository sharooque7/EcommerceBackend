const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");
const CartModel = require("../models/cartModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const createPaymenIntent = async (req, res, next) => {
  //apply coupoun
  // later calculate cart total
  console.log("couponApplied" + req.body.couponApplied);

  const { couponApplied } = req.body;

  const user = await User.findOne({ email: req.user.email }).exec();

  const { cartTotal, totalAfterDiscount } = await CartModel.findOne({
    orderBy: user._id,
  }).exec();

  console.log("CartTotal", cartTotal);
  console.log("CartTotal", totalAfterDiscount);

  let finalAmunt = 0;

  if (couponApplied && totalAfterDiscount) {
    finalAmunt = totalAfterDiscount * 100;
  } else {
    finalAmunt = cartTotal * 100;
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: finalAmunt,
    currency: "inr",
  });

  console.log(paymentIntent.client_secret);

  res.status(201).send({
    clientSecret: paymentIntent.client_secret,
    cartTotal,
    totalAfterDiscount,
    payable: finalAmunt,
  });
};

module.exports = { createPaymenIntent };
