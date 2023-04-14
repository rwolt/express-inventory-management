const { body, validationResult } = require("express-validator");
const Item = require("../models/item");
const Category = require("../models/category");

const async = require("async");

exports.item_list = async (req, res) => {
  const items = await Item.find({});
  res.render("item_list", { title: "All Items", items });
};

exports.item_detail = async (req, res) => {
  const item = await Item.findById(req.params.id).populate("category");
  if (item == null) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }
  res.render("item_detail", { title: item.name, item });
};

exports.item_create_get = (req, res) => {
  async.parallel(
    {
      categories(callback) {
        Category.find({}).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("item_form", {
        title: "Create new Item",
        categories: results.categories,
      });
    }
  );
  return;
};

exports.item_create_post = [
  // Validate and Sanitize the request
  body("name", "Name is required").trim().isLength({ min: 1 }).escape(),
  body("description").trim().escape(),
  body("category", "Category is required").trim().isLength({ min: 1 }).escape(),
  body("unitOfMeasure", "UOM is required").trim().isLength({ min: 1 }).escape(),
  body("price", "Price is required")
    .trim()
    .isLength({ min: 1 })
    .toFloat()
    .escape(),
  body("leadTime", "Lead time is required")
    .trim()
    .isLength({ min: 1 })
    .toInt()
    .escape(),
  body("safetyStock", "Safety stock is required")
    .trim()
    .isLength({ min: 1 })
    .toInt()
    .escape(),
  body("dailyAverageUsage", "Daily average usage is required")
    .trim()
    .isLength({ min: 1 })
    .toInt()
    .escape(),
  body("quantityAvailable", "Quantity available is required")
    .trim()
    .isLength({ min: 1 })
    .toInt()
    .escape(),
  // Extract errors from the input
  (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
    // Create an item from using the validated and sanitized input
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      unitOfMeasure: req.body.unitOfMeasure,
      price: req.body.price,
      leadTime: req.body.leadTime,
      safetyStock: req.body.safetyStock,
      dailyAverageUsage: req.body.dailyAverageUsage,
      quantityAvailable: req.body.quantityAvailable,
    });
    // If there are errors, rerender the form with the validated and sanitized body and the errors
    if (!errors.isEmpty()) {
      async.parallel(
        {
          categories(callback) {
            Category.find({}).exec(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          res.render("item_form", {
            title: "Create new Item",
            item,
            categories: results.categories,
            errors: errors.array(),
          });
        }
      );
      return;
    }
    // Save the item and redirect to the items url
    item.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect(item.url);
    });
  },
];

exports.item_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: item update GET");
};

exports.item_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: item update POST");
};

exports.item_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: item delete GET");
};

exports.item_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: item delete POST");
};
