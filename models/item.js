const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 240 },
  description: { type: String, required: false, maxLength: 500 },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  unitOfMeasure: { type: String, enum: ["ea", "lb"] },
  price: { type: Number, required: true, min: 0 },
  quantityInStock: { type: Number, required: true, min: 0 },
});

// Virtual for item URL

ItemSchema.virtual("url").get(function () {
  return `/item/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
