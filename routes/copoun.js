const router = require("express").Router();

const { authCheck, adminCheck } = require("../middlewares/auth");
const { create, list, remove } = require("../controllers/couponController");

router.post("/coupons", authCheck, adminCheck, create);

router.get("/coupons", authCheck, adminCheck, list);

router.delete("/coupons/:couponId", authCheck, adminCheck, remove);

module.exports = router;
