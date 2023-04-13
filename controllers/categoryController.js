const Category = require("../models/category");
const Item = require("../models/item");

const async = require("async");

exports.index = (req, res) => {
  res.render("index", { title: "Easy Stock" });
};

exports.category_list = async (req, res) => {
  const categories = await Category.find({});
  res.render("category_list", { title: "Category List", categories });
};

exports.category_detail = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
      items(callback) {
        Item.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.category == null) {
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
      }
      res.render("category_detail", {
        title: results.category.name,
        category: results.category,
        items: results.items,
      });
    }
  );
};

exports.category_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Category create GET");
};

exports.category_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Category create POST");
};

exports.category_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Category update GET");
};

exports.category_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Category update POST");
};

exports.category_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Category delete GET");
};

exports.category_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Category delete POST");
};
