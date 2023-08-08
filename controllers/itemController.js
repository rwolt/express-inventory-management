const { body, validationResult } = require("express-validator");
const Item = require("../models/item");
const Category = require("../models/category");

const async = require("async");
const path = require("path");
const multer = require("multer");

// Configure multer disk storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

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

exports.item_create_get = async (req, res) => {
  const categories = await Category.find({});
  if (categories === null) {
    const err = new Error("No categories");
    req.status = 404;
    return next(err);
  }
  res.render("item_form", {
    title: "Create new Item",
    categories,
  });
};

exports.item_create_post = [
  // Upload item image using multer
  upload.single("item_image"),
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
    console.log(req.body, req.file);
    const errors = validationResult(req);
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
      image: req.file.filename,
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
            title: "Add new Item",
            buttonText: "Add Item",
            name: item.name,
            description: item.description,
            category: item.category.name,
            unitOfMeasure: item.unitOfMeasure,
            price: item.price,
            leadTime: item.leadTime,
            safetyStock: item.safetyStock,
            dailyAverageUsage: item.dailyAverageUsage,
            quantityAvailable: item.quantityAvailable,
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

exports.item_update_get = async (req, res, next) => {
  async.parallel(
    {
      item(callback) {
        Item.findById(req.params.id).exec(callback);
      },
      categories(callback) {
        Category.find({}).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.item == null) {
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      res.render("item_form", {
        title: "Update Item",
        buttonText: "Update Item",
        name: results.item.name,
        description: results.item.description,
        category: results.item.category,
        unitOfMeasure: results.item.unitOfMeasure,
        price: results.item.price,
        leadTime: results.item.leadTime,
        safetyStock: results.item.safetyStock,
        dailyAverageUsage: results.item.dailyAverageUsage,
        quantityAvailable: results.item.quantityAvailable,
        imageURL: results.item.image ? results.item.imageURL : "",
        categories: results.categories,
      });
    }
  );
};

exports.item_update_post = [
  async (req, res, next) => {
    const item = await Item.findById(req.params.id);
    const itemImage = item.image;
    console.log(itemImage);
    req.body.image = itemImage;
    console.log(req.body);
    next();
  },
  upload.single("item_image"),
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

  (req, res, next) => {
    const errors = validationResult(req);
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
      categories: req.body.categories,
      image: req.file ? req.file.filename : req.body.image,
      _id: req.params.id,
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
            title: "Update Item",
            buttonText: "Update Item",
            name: item.name,
            description: item.description,
            category: item.category,
            unitOfMeasure: item.unitOfMeasure,
            price: item.price,
            leadTime: item.leadTime,
            safetyStock: item.safetyStock,
            dailyAverageUsage: item.dailyAverageUsage,
            quantityAvailable: item.quantityAvailable,
            categories: results.categories,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    Item.findByIdAndUpdate(req.params.id, item, {}, (err, results) => {
      if (err) {
        return next(err);
      }
      res.redirect(item.url);
    });
  },
];

exports.item_delete_get = async (req, res) => {
  const item = await Item.findById(req.params.id);
  res.render("item_delete", { item });
};

exports.item_delete_post = (req, res) => {
  Item.findByIdAndRemove(req.body.itemId, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/shop/items");
  });
};
