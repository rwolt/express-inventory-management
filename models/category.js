const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: false, maxLength: 100 },
  image: { type: String, required: false },
});

// Virtual for category URL

CategorySchema.virtual("url").get(function () {
  return `/shop/category/${this._id}`;
});

CategorySchema.virtual("imageURL").get(function () {
  if (this.image) {
    return `/uploads/images/${this.image}`;
  } else {
    return `/images/supplies.png`;
  }
});

module.exports = mongoose.model("Category", CategorySchema);
