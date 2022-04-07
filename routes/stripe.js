const express = require("express");

const router = express.Router();

const { createPaymenIntent } = require("../controllers/stripeController");

const { authCheck } = require("../middlewares/auth");

router.post("/create-payment-intent", authCheck, createPaymenIntent);

module.exports = router;
