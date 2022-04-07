const router = require("express").Router();

const { authCheck } = require("../middlewares/auth");
const {
  userCart,
  getUserCart,
  emptyCart,
  saveAddreess,
  applyCoupontoUserCart,
  createOrder,
  orders,
  addToWishlist,
  wishlist,
  removeFromWishlist,
  createCashOrder,
} = require("../controllers/userController");
router.post("/user/cart", authCheck, userCart);

router.get("/user/cart", authCheck, getUserCart);

router.delete("/user/cart", authCheck, emptyCart);

router.post("/user/address", authCheck, saveAddreess);

router.post("/user/cart/coupon", authCheck, applyCoupontoUserCart);

router.post("/user/order", authCheck, createOrder);

router.get("/user/orders", authCheck, orders);

router.post("/user/wishlist", authCheck, addToWishlist);

router.get("/user/wishlist", authCheck, wishlist);

router.put("/user/wishlist/:productId", authCheck, removeFromWishlist);

router.post("/user/cash-order", authCheck, createCashOrder);
module.exports = router;
