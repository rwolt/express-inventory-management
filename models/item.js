const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 240 },
  description: { type: String, required: false, maxLength: 500 },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  unitOfMeasure: { type: String, enum: ["ea", "lb"] },
  price: { type: Number, required: true, min: 0 },
  leadTime: { type: Number, required: true, min: 0 },
  safetyStock: { type: Number, required: true, min: 0 },
  dailyAverageUsage: { type: Number, required: true, min: 0 },
  quantityAvailable: { type: Number, required: true, min: 0 },
  image: { type: String },
});

// Virtual for item URL

ItemSchema.virtual("url").get(function () {
  return `/shop/item/${this._id}`;
});

ItemSchema.virtual("imageURL").get(function () {
  if (this.image) {
    return `/uploads/images/${this.image}`;
  } else {
    return `/images/supplies.png`;
  }
});

ItemSchema.virtual("reorderPoint").get(function () {
  return this.dailyAverageUsage * this.leadTime + this.safetyStock;
});

module.exports = mongoose.model("Item", ItemSchema);
