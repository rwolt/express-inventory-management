#! /usr/bin/env node

console.log(
  'This script populates some test items and categories. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require("./models/category");
const Item = require("./models/item");

const categories = [];
const items = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function categoryCreate(name, description) {
  const categoryDetail = { name };
  if (description != false) categoryDetail.description = description;
  const category = new Category(categoryDetail);
  await category.save();
  categories.push(category);
  console.log(`Added category: ${name}`);
}

async function itemCreate(
  name,
  description,
  category,
  unitOfMeasure,
  price,
  leadTime,
  safetyStock,
  dailyAverageUsage,
  quantityAvailable
) {
  const itemDetail = {
    name,
    category,
    unitOfMeasure,
    price,
    leadTime,
    safetyStock,
    dailyAverageUsage,
    quantityAvailable,
  };
  if (description != false) itemDetail.description = description;
  const item = new Item(itemDetail);
  await item.save();
  items.push(item);
  console.log(`Added item: ${name} ${price}`);
}

async function createCategories() {
  console.log("Adding Categories");
  await Promise.all([
    categoryCreate("Bakery"),
    categoryCreate("Frozen"),
    categoryCreate("Pantry"),
    categoryCreate("Fresh"),
    categoryCreate("Beverages"),
  ]);
}

async function createItems() {
  console.log("Adding Items");
  await Promise.all([
    itemCreate(
      "French Loaf 2 Count",
      "8 oz Loaves",
      categories[3],
      "ea",
      2.99,
      1,
      10,
      45,
      50
    ),
    itemCreate(
      "San Francisco Sour Dough Bread",
      "24 oz Loaf",
      categories[3],
      "ea",
      3.99,
      1,
      5,
      25,
      30
    ),
    itemCreate(
      "Tombstone Original 5 Cheese Frozen Pizza",
      "Tombstone Five Cheese Frozen Pizza delivers full on flavor that's ideal for a quick lunch or easy dinner. ",
      categories[0],
      "ea",
      4.5,
      7,
      50,
      200,
      1700
    ),
    itemCreate(
      "Hot Pockets Applewood Bacon, Egg & Cheese Croissant Crust Frozen Sandwiches 2 pk",
      "Make breakfast time anytime with Hot Pockets Applewood Bacon, Egg and Cheese Croissant Crust Frozen Breakfast Sandwiches. Each scrumptious microwave sandwich is loaded with eggs, applewood bacon and reduced-fat cheddar cheese wrapped inside a delicious flaky croissant crust.",
      categories[0],
      "ea",
      4.49,
      7,
      15,
      35,
      300
    ),
    itemCreate(
      "Corner Market Cut Green Beans",
      "SATISFACTION GUARANTEED OR PURCHASE PRICE REFUNDED FOR INFORMATION CALL 1-800-555-5555 - GUARANTEED QUALITY",
      categories[1],
      "ea",
      1.09,
      3,
      200,
      350,
      2300
    ),
    itemCreate(
      "Corner Market Chili Style Beans in Chili Gravy",
      "SATISFACTION GUARANTEED FOR INFORMATION CALL 1-800-555-5555 MICROWAVE: EMPTY CONTENTS INTO MICROWAVE-SAFE BOWL, COVER LOOSELY. MICROWAVE ON HIGH 3 MINUTES. STIR BEFORE SERVING. (ALL MICROWAVE OVENS VARY. TIMES GIVEN ARE APPROXIMATE.) STOVE TOP: EMPTY CONTENTS INTO SAUCEPAN. SIMMER OVER MEDIUM HEAT FOR 6 MINUTES OR UNTIL HOT, STIRRING OCCASIONALLY. REFRIGERATE UNUSED PORTION BEST IF USED BY DATE ON CAN END",
      categories[1],
      "ea",
      0.69,
      3,
      300,
      400,
      2600
    ),
    itemCreate(
      "Honeycrisp Apples",
      "",
      categories[2],
      "lb",
      2.98,
      5,
      50,
      450,
      1400
    ),
    itemCreate(
      "Red Bell Pepper",
      "Sweet, Mild Taste",
      categories[2],
      "ea",
      1.34,
      5,
      45,
      220,
      600
    ),
    itemCreate(
      "Corner Market 2% Milk",
      "When you see the Corner Market logo, you know you're getting an amazing deal, as long as you appreciate quality that’s affordable. Check out the entire collection of Corner Market products—everything from milk and eggs to vegetables and pasta—we’re talking hundreds of items to help you fill your basket with the foods you love at prices you love.",
      categories[4],
      "ea",
      4.19,
      3,
      60,
      550,
      1000
    ),
    itemCreate(
      "Simply Orange Pulp Free Juice",
      "100% pure squeezed pasteurized orange juice. 110 calories per 8 fl oz serving. No added sugar (Not a reduced calorie food see nutrition facts for sugar & calorie content). Non GMO (Non GMO Project verified. nongmoproject.org). Not from concentrate. Pasteurized. Contains orange juice from countries identified on bottle neck. Fresh taste guaranteed. www.simplyorangejuice.com.",
      categories[4],
      "ea",
      4.79,
      5,
      25,
      120,
      700
    ),
  ]);
}
