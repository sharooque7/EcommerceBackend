const Category = require("../models/categoryModel");
const Subcategory = require("../models/subCategory");
const Product = require("../models/productModel");

const slugify = require("slugify");

const create = async (req, res, next) => {
  try {
    const { name } = req.body;
    console.log(req.body);
    const category = await new Category({ name, slug: slugify(name) }).save();
    res.status(201).json(category);
  } catch (error) {
    console.log(error);
    res.status(400).send("Create category failed or duplicate found");
  }
};

const read = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug: slug }).exec();

    const products = await Product.find({ category })
      .populate("category")
      .populate("rating.$.postedBy", "_id name")
      .exec();
    res.status(201).json({ category, products });
  } catch (error) {
    console.log(error + "-----------------Hi----------");
    res.status(400).send("fetching of category failed please retry");
  }
};

const update = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { name } = req.body;
    console.log(slug, name);
    const category = await Category.findOneAndUpdate(
      { slug: slug },
      { name, slug: slugify(name) },
      { new: true }
    ).exec();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).send("Update of category failed please retry");
  }
};

const remove = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOneAndDelete({ slug: slug }).exec();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).send("Delete of category failed please retry");
  }
};

const list = async (req, res, next) => {
  try {
    const category = await Category.find().sort({ createdAt: -1 }).exec();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).send("fetching of categories failed");
  }
};

const getSubs = async (req, res, next) => {
  await Subcategory.find({ parent: req.params._id }).exec((err, subs) => {
    console.log(err);
    res.status(201).json(subs);
  });
};

module.exports = { create, read, update, remove, list, getSubs };
