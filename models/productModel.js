const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const productScheme = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      require: true,
      maxlength: 32,
      text: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
      text: true,
    },
    description: {
      type: String,
      require: true,
      maxlength: 2002,
      text: true,
    },
    price: {
      type: Number,
      trim: true,
      require: true,
      maxlength: 32,
    },
    category: {
      type: ObjectId,
      ref: "Category",
    },
    subs: [
      {
        type: ObjectId,
        ref: "Subcategory",
      },
    ],
    quantity: Number,
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    shipping: {
      type: String,
      enum: ["Yes", "No"],
    },
    color: {
      type: String,
      enum: ["Black", "Brown", "Silver", "White", "Blue"],
    },
    brand: {
      type: String,
      enum: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"],
    },
    rating: [{ star: Number, postedBy: { type: ObjectId, ref: "User" } }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productScheme);
