const { body, validationResult } = require("express-validator");
const Category = require("../models/category");
const Item = require("../models/item");
const Password = require("../models/password");

const async = require("async");
const path = require("path");
const multer = require("multer");

// Configure multer disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

exports.index = (req, res) => {
  res.render("index", { title: "Easy Stock" });
};

exports.category_list = async (req, res, next) => {
  await Category.find({}).exec((err, categories) => {
    if (err) {
      return next(err);
    }
    if (categories == null) {
      const err = new Error("No categories found");
      err.status = 404;
      return next(err);
    }
    res.render("category_list", { title: "All Categories", categories });
  });
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
  res.render("category_form", {
    title: "Add new Category",
    buttonText: "Add Category",
  });
};

exports.category_create_post = [
  upload.single("category_image"),
  // Validate and Sanitize fields
  body("name", "Name is required")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body("description").trim().isLength({ max: 100 }).escape(),
  body("adminPassword").escape(),
  async (req, res, next) => {
    console.log(req.body);
    const passwordDoc = await Password.findOne();
    const password = passwordDoc.get("password");
    if (password !== req.body.adminPassword) {
      const err = new Error("Incorrect password");
      err.status = 500;
      return next(err);
    }
    next();
  },
  // Process request after validation
  (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);
    // Create category object with escaped and trimmed data
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      image: req.file ? req.file.filename : null,
    });

    // If error, rerender form again with sanitized values/error messages
    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Add new Category",
        buttonText: "Add Category",
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

exports.category_update_get = async (req, res, next) => {
  await Category.findById(req.params.id).exec((err, category) => {
    if (err) {
      return next(err);
    }
    if (category == null) {
      const err = new Error("Category not found");
      err.status = 404;
      return next(err);
    }
    res.render("category_form", {
      title: "Update category",
      buttonText: "Update Category",
      category,
    });
  });
};

exports.category_update_post = [
  async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    const categoryImage = category.image;
    req.body.categoryImage = categoryImage;
    next();
  },
  upload.single("category_image"),
  body("name", "Name is required")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body("description").trim().isLength({ max: 100 }).escape(),
  body("adminPassword").escape(),
  async (req, res, next) => {
    console.log(req.body);
    const passwordDoc = await Password.findOne();
    const password = passwordDoc.get("password");
    if (password !== req.body.adminPassword) {
      const err = new Error("Incorrect password");
      err.status = 500;
      return next(err);
    }
    next();
  },
  async (req, res, next) => {
    console.log(req.body);
    const passwordDoc = await Password.findOne();
    const password = passwordDoc.get("password");
    if (password !== req.body.adminPassword) {
      const err = new Error("Incorrect password");
      err.status = 500;
      return next(err);
    }
    next();
  },
  (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      image: req.file ? req.file.filename : req.body.image,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Update Category",
        buttonText: "Update Category",
        category,
        errors: errors.array(),
      });
      return;
    }

    // If valid, save category and redirect to new category record

    Category.findByIdAndUpdate(req.params.id, category, {}, (err, results) => {
      if (err) {
        return next(err);
      }
      res.redirect(category.url);
    });
  },
];

exports.category_delete_get = async (req, res, next) => {
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
        res.redirect("/shop/categories");
      }

      res.render("category_delete", {
        title: "Delete Category",
        category: results.category,
        items: results.items,
      });
    }
  );
};

exports.category_delete_post = [
  upload.none(),
  body("adminPassword").escape(),
  async (req, res, next) => {
    console.log(req.body);
    const passwordDoc = await Password.findOne();
    const password = passwordDoc.get("password");
    if (password !== req.body.adminPassword) {
      const err = new Error("Incorrect password");
      err.status = 500;
      return next(err);
    }
    next();
  },
  (req, res, next) => {
    Category.findByIdAndRemove(req.body.categoryId, (err) => {
      if (err) {
        return next(err);
      }
    });
    next();
  },
];
