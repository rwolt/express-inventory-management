const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PasswordSchema = new Schema({
  adminPassword: { type: String, required: true, maxLength: 30 },
});

module.exports = mongoose.model("passwords", PasswordSchema);
