const User = require("../models/userModel");

const Order = require("../models/orderModel");

const orderStatus = async (req, res, next) => {
  const { orderId, orderStatus } = req.body;

  let updated = await Order.findByIdAndUpdate(
    { _id: orderId },
    { orderStatus },
    { new: true }
  ).exec();

  res.json(updated);
};

const orders = async (req, res, next) => {
  let allOrders = await Order.find({})
    .sort("-createdAt")
    .populate("products.product")
    .exec();

  res.json(allOrders);
};

module.exports = { orderStatus, orders };
