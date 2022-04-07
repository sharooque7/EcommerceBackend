const router = require("express").Router();

const { authCheck, adminCheck } = require("../middlewares/auth");

const {
  create,
  listAll,
  update,
  remove,
  list,
  read,
  productsCount,
  productStar,
  listRelated,
  serachFilters,
} = require("../controllers/productController");

router.post("/createproduct", authCheck, adminCheck, create);

router.get("/products/total", productsCount);
//return jusn count
router.get("/products/:count", listAll);

router.delete("/products/:slug", authCheck, adminCheck, remove);

router.get("/product/:slug", read);

router.put("/product/:slug", authCheck, adminCheck, update);

router.post("/products", list);

router.post("/product/star/:productId", authCheck, productStar);

router.get("/product/related/:productId", listRelated);

router.post("/search/filters", serachFilters);
module.exports = router;
