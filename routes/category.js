const router = require("express").Router();

const { authCheck, adminCheck } = require("../middlewares/auth");

const {
  create,
  read,
  update,
  remove,
  list,
  getSubs,
} = require("../controllers/categoryController");

//create category
router.post("/category", authCheck, adminCheck, create);

//Get category
router.get("/categories", list);
//Read category
//router.post("/category/:slug", authCheck, adminCheck, read);

router.get("/category/:slug", read);

//update category
router.put("/category/:slug", authCheck, adminCheck, update);
//remove category
router.delete("/category/:slug", authCheck, adminCheck, remove);

router.get("/category/sub/:_id", getSubs);

module.exports = router;
