const Item = require("../models/item");

exports.item_list = (req, res) => {
  res.send("NOT IMPLEMENTED: item list");
};

exports.item_detail = async (req, res) => {
  const item = await Item.findById(req.params.id).populate("category");
  if (item == null) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }
  res.render("item_detail", { item });
};

exports.item_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: item create GET");
};

exports.item_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: item create POST");
};

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
