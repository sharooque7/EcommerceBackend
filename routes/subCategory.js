const router = require("express").Router();

const { authCheck, adminCheck } = require("../middlewares/auth");

const {
  create,
  read,
  update,
  remove,
  list,
} = require("../controllers/subCategory");

//create product
router.post("/subcategory", authCheck, adminCheck, create);

router.post("/subcategory", authCheck, adminCheck, create);
router.get("/subcategories", list);
router.get("/subcategory/:slug", read);
router.put("/subcategory/:slug", authCheck, adminCheck, update);
router.delete("/subcategory/:slug", authCheck, adminCheck, remove);

module.exports = router;
