const Product = require("../models/productModel");
const slugify = require("slugify");
const User = require("../models/userModel");

const create = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log(req.body.title);
    console.log(req.body.subs);
    req.body.slug = slugify(req.body.title);
    console.log(req.body.slug + "------------");
    const newProduct = await new Product(req.body).save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const listAll = async (req, res, next) => {
  try {
    const newProduct = await Product.find({})
      .limit(parseInt(req.params.count))
      .populate("category")
      .populate("subs")
      .sort([["createdAt", "desc"]])
      .exec();
    res.status(201).json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res, next) => {
  console.log(req.params.slug);
  try {
    const deleted = await Product.findOneAndDelete({
      slug: req.params.slug,
    }).exec();
    res.status(201).json(deleted);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Product delete failed");
  }
};

const read = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("category")
      .populate("subs")
      .exec();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const update = async (req, res, next) => {
  console.log(req.body);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    );
    res.status(201).json(updated);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// without pagination
// const list = async (req, res, next) => {
//   try {
//     const { sort, order, limit } = req.body;
//     const products = await Product.find({})
//       .populate("category")
//       .populate("subs")
//       .sort([[sort, order]])
//       .limit(limit)
//       .exec();
//     res.status(201).json(products);
//   } catch (error) {
//     console.log(error);
//   }
// };

const list = async (req, res, next) => {
  try {
    const { sort, order, page } = req.body;
    const currentPage = page || 1;
    const perPage = 3;

    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("subs")
      .sort([[sort, order]])
      .limit(perPage)
      .exec();
    res.status(201).json(products);
  } catch (error) {
    console.log(error);
  }
};

const productsCount = async (req, res, next) => {
  try {
    const total = await Product.find({}).estimatedDocumentCount().exec();
    res.status(201).json(total);
  } catch (error) {
    res.status(400).json(error);
  }
};
// const productStar = async (req, res, next) => {
//   const product = await Product.findById(req.params.productId).exec();

//   const user = await User.findOne({ email: req.ser.email }).exec();

//   const { star } = req.body; //who is updating

//   let existingRating = await product.rating.find(
//     (ele) => ele.postedBy.toString() === user._id.toString()
//   );

//   //if users not rated
//   if (existingRating === undefined) {
//     let ratingAdded = await Product.findByIdAndUpdate(
//       product._id,
//       {
//         $push: { rating: { star: star, postedBy: user._id } },
//       },
//       { new: true }
//     ).exec();
//     res.status(201).json(ratingAdded);
//   } else {
//     const ratingUpdated = await Product.updateOne(
//       {
//         rating: { $elemMatch: existingRating },
//       },
//       { $set: { "ratings.$.star": star } },
//       { new: true }
//     ).exec();
//     res.status(201).json(ratingUpdated);
//   }
// };

const productStar = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).exec();

    const user = await User.findOne({ email: req.user.email }).exec();

    console.log("Hi sharooque---------" + user._id.toString());
    const { star } = req.body;

    // who is updating?
    // check if currently logged in user have already added rating to this product?
    let existingRatingObject = product.rating.find(
      (ele) => ele.postedBy.toString() === user._id.toString()
    );

    console.log("Hi---------" + existingRatingObject);

    // if user haven't left rating yet, push it
    if (existingRatingObject === undefined) {
      let ratingAdded = await Product.findByIdAndUpdate(
        product._id,
        {
          $push: { rating: { star, postedBy: user._id } },
        },
        { new: true }
      ).exec();

      console.log("ratingAdded", ratingAdded);
      res.status(201).json(ratingAdded);
    } else {
      // if user have already left rating, update it
      const ratingUpdated = await Product.updateOne(
        {
          rating: { $elemMatch: existingRatingObject },
        },
        { $set: { "rating.$.star": star } },
        { new: true }
      ).exec();
      console.log("ratingUpdated", ratingUpdated);

      res.status(201).json(ratingUpdated);
    }
  } catch (error) {
    console.log("Hi");
    console.log(error);
  }
};

const listRelated = async (req, res, next) => {
  const product = await Product.findById(req.params.productId).exec();

  ///Here query by all product except that product and also by the category it belongs to
  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(3)
    .populate("category")
    .populate("subs")
    .populate("rating.$.postedBy")
    .exec();

  res.status(201).json(related);
};
//search filters
const handleQuery = async (req, res, query) => {
  try {
    const products = await Product.find({ $text: { $search: query } })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .populate("rating.$.postedBy", "_id name")
      .exec();
    res.status(201).json(products);
  } catch (error) {
    console.log(error);
    res.status(404).json("Text based search failed");
  }
};

const handlePrice = async (req, res, price) => {
  try {
    const products = await Product.find({
      price: { $gte: price[0], $lte: price[1] },
    })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .populate("rating.$.postedBy", "_id name")
      .exec();

    res.status(201).json(products);
  } catch (error) {
    console.log(error);
    res.status(404).json("Price based search failed");
  }
};

const handleCategory = async (req, res, category) => {
  try {
    let products = await Product.find({ category })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .populate("rating.$.postedBy", "_id name")
      .exec();
    res.status(201).json(products);
  } catch (error) {
    console.log(error);
    res.status(404).json("Catogory based search failed");
  }
};

const handleStar = async (req, res, star) => {
  const product = await Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        floorAvergae: {
          $floor: { $avg: "$rating.star" },
        },
      },
    },
    { $match: { floorAvergae: star } },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log("AGGREGATE ERROR", err);
      Product.find({ _id: aggregates })
        .populate("category", "_id name")
        .populate("subs", "_id name")
        .populate("rating.$.postedBy", "_id name")
        .exec((err, products) => {
          if (err) console.log("Error", err);

          res.status(201).json(products);
        });
    });
};
const handleSub = async (req, res, sub) => {
  const products = await Product.find({ subs: sub })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("rating.$.postedBy", "_id name")
    .exec();

  console.log(products);

  res.status(201).json(products);
};

const handleShipping = async (req, res, shipping) => {
  const products = await Product.find({ shipping })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("rating.$.postedBy", "_id name")
    .exec();
  console.log(products);

  res.status(201).json(products);
};
const handleColor = async (req, res, color) => {
  const products = await Product.find({ color })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("rating.$.postedBy", "_id name")
    .exec();

  console.log(products);

  res.status(201).json(products);
};
const handleBrand = async (req, res, brand) => {
  const products = await Product.find({ brand })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("rating.$.postedBy", "_id name")
    .exec();

  console.log(products);

  res.status(201).json(products);
};

const serachFilters = async (req, res, next) => {
  const { query, price, category, star, sub, shipping, color, brand } =
    req.body;

  if (query) {
    console.log(query);
    await handleQuery(req, res, query);
  }

  //price 0--something
  if (price !== undefined) {
    console.log("price ", price);
    await handlePrice(req, res, price);
  }

  if (category) {
    console.log("category", category);
    await handleCategory(req, res, category);
  }

  if (star) {
    console.log("star", star);
    await handleStar(req, res, star);
  }

  if (sub) {
    console.log("star", sub);
    await handleSub(req, res, sub);
  }

  if (shipping) {
    console.log("star", shipping);
    await handleShipping(req, res, shipping);
  }
  if (color) {
    console.log("star", color);
    await handleColor(req, res, color);
  }
  if (brand) {
    console.log("star", brand);
    await handleBrand(req, res, brand);
  }
};

module.exports = {
  serachFilters,
  create,
  list,
  listAll,
  remove,
  read,
  update,
  productsCount,
  productStar,
  listRelated,
};
