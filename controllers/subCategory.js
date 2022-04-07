const SubCategory = require("../models/subCategory");
const slugify = require("slugify");
const Product = require("../models/productModel");

const create = async (req, res, next) => {
  try {
    const { name, id } = req.body;
    console.log(name, id);
    console.log(req.body);
    const newSubCategory = await new SubCategory({
      name,
      parent: id,
      slug: slugify(name),
    }).save();
    res.status(201).json(newSubCategory);
  } catch (error) {
    console.log(error);
    res.status(400).send("Create category failed or duplicate found");
  }
};

const read = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const newSubCategory = await SubCategory.findOne({ slug: slug }).exec();

    const products = await Product.find({ subs: newSubCategory })
      .populate("category")
      .exec();
    res.status(201).json({ subs: newSubCategory, products });
  } catch (error) {
    res.status(400).send("fetching of SubCategory failed please retry");
  }
};

const update = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { name, id } = req.body;
    console.log(slug, name);
    const newSubCategory = await SubCategory.findOneAndUpdate(
      { slug: slug },
      { name, parent: id, slug: slugify(name) },
      { new: true }
    ).exec();
    res.status(201).json(newSubCategory);
  } catch (error) {
    res.status(400).send("Update of SubCategory failed please retry");
  }
};

const remove = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const newSubCategory = await SubCategory.findOneAndDelete({
      slug: slug,
    }).exec();
    res.status(201).json(newSubCategory);
  } catch (error) {
    res.status(400).send("Delete of SubCategory failed please retry");
  }
};

const list = async (req, res, next) => {
  try {
    const newSubCategory = await SubCategory.find()
      .sort({ createdAt: -1 })
      .exec();
    res.status(201).json(newSubCategory);
  } catch (error) {
    res.status(400).send("fetching of subcategories failed");
  }
};

module.exports = { create, read, update, remove, list };
