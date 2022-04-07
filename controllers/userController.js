const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const uniqueid = require("uniqueid");

exports.userCart = async (req, res, next) => {
  try {
    const { cart } = req.body;

    let products = [];

    const user = await User.findOne({ email: req.user.email }).exec();

    //chck if cart with ooged in user id exist
    let cartExistByUser = await Cart.findOne({ orderBy: user._id }).exec();

    if (cartExistByUser) {
      cartExistByUser.remove();
    }

    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;

      let { price } = await Product.findById(cart[i]._id)
        .select("price")
        .exec();
      object.price = price;

      products.push(object);
    }
    console.log("products", products);

    let cartTotal = 0;
    for (i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }

    console.log(cartTotal);

    let newCart = await new Cart({
      products: products,
      cartTotal,
      orderBy: user._id,
    }).save();

    console.log(newCart);

    res.status(201).json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.getUserCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();

  let cart = await Cart.findOne({ orderdBy: user._id })
    .populate("products.product", "_id title price totalAfterDiscount")
    .exec();

  const { products, cartTotal, totalAfterDiscount } = cart;
  res.status(201).json({ products, cartTotal, totalAfterDiscount });
};

exports.emptyCart = async (req, res, next) => {
  const user = await User.findOne({ email: req.user.email }).exec();

  let cart = await Cart.findOneAndRemove({ orderdBy: user._id }).exec();

  res.status(201).json(cart);
};

exports.saveAddreess = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      { address: req.body.address }
    ).exec();

    res.status(201).json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

exports.applyCoupontoUserCart = async (req, res, next) => {
  const { coupon } = req.body;
  console.log("coupon", coupon);

  const validCoupon = await Coupon.findOne({ name: coupon }).exec();

  if (validCoupon === null) {
    return res.status(201).json({ err: "Invalid Coupon" });
  }
  console.log("Valid", validCoupon);

  const user = await User.findOne({ email: req.user.email }).exec();

  console.log("user", user);

  let { products, cartTotal } = await Cart.findOne({
    orderBy: user._id,
  })
    .populate("products.product", "_id title price")
    .exec();

  //calculate total after discount

  console.log("cartTotal", cartTotal);

  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);

  Cart.findOneAndUpdate(
    { orderBy: user._id },
    { totalAfterDiscount },
    { new: true }
  ).exec();

  console.log("totalAfterDiscount", totalAfterDiscount);

  res.status(201).json(totalAfterDiscount);
};

exports.createOrder = async (req, res, next) => {
  console.log(req.body.stripeResponse);

  const { paymentIntent } = req.body.stripeResponse;

  const user = await User.findOne({ email: req.user.email }).exec();

  let { products } = await Cart.findOne({ orderBy: user._id }).exec();

  let newOrder = await new Order({
    products,
    paymentIntent,
    orderBy: user._id,
  }).save();

  //decrement quantity nand increment sold

  let bulkOption = products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  let updated = await Product.bulkWrite(bulkOption);

  console.log("BULK Updated", updated);

  console.log("newOrder", newOrder);
  res.status(201).json({ ok: true });
};

exports.orders = async (req, res, next) => {
  let user = await User.findOne({ email: req.user.email }).exec();

  let userOrders = await Order.find({ orders: user._id })
    .populate("products.product")
    .exec();

  console.log(userOrders);

  res.status(201).json(userOrders);
};

exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;

  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $addToSet: { wishlist: productId } }
  ).exec();

  res.json({ ok: true });
};

exports.wishlist = async (req, res, next) => {
  let list = await User.findOne({ email: req.user.email })
    .select("wishlist")
    .populate("wishlist")
    .exec();
  res.json(list);
};

exports.removeFromWishlist = async (req, res, next) => {
  let { productId } = req.params;

  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { wishlist: productId } }
  ).exec();

  res.json({ ok: true });
};

exports.createCashOrder = async (req, res, next) => {
  console.log(req.body.stripeResponse);

  const { COD, couponApplied } = req.body;

  if (!COD) return res.status(400).send("Create cash order failed");

  const user = await User.findOne({ email: req.user.email }).exec();

  let userCart = await Cart.findOne({ orderBy: user._id }).exec();

  let finalAmunt = 0;

  if (couponApplied && userCart.totalAfterDiscount) {
    finalAmunt = userCart.totalAfterDiscount * 100;
  } else {
    finalAmunt = userCart.cartTotal * 100;
  }

  let newOrder = await new Order({
    products: userCart.products,
    paymentIntent: {
      id: uniqueid(),
      amount: finalAmunt,
      status: "Cash On Delivery",
      currency: "inr",
      created: Date.now(),
      payment_method_types: ["Cash"],
    },
    orderBy: user._id,
    orderStatus: "Cash On Delivery",
  }).save();

  //decrement quantity nand increment sold

  let bulkOption = userCart.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  let updated = await Product.bulkWrite(bulkOption);

  console.log("BULK Updated", updated);

  console.log("newOrder", newOrder);
  res.status(201).json({ ok: true });
};
