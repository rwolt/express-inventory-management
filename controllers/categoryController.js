const { body, validationResult } = require("express-validator");
const Category = require("../models/category");
const Item = require("../models/item");

const async = require("async");

exports.index = (req, res) => {
  res.render("index", { title: "Easy Stock" });
};

exports.category_list = async (req, res) => {
  const categories = await Category.find({});
  res.render("category_list", { title: "All Categories", categories });
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
  res.render("category_form", { title: "Add new Category" });
};

exports.category_create_post = [
  // Validate and Sanitize fields
  body("name", "Name is required")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body("description").trim().isLength({ max: 100 }).escape(),
  // Process request after validation
  (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);
    // Create category object with escaped and trimmed data
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    // If error, rerender form again with sanitized values/error messages
    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Add new Category",
        category,
        errors: errors.array(),
      });
      return;
    }

    // If valid, save category and redirect to new category record

    category.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect(category.url);
    });
  },
];

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
