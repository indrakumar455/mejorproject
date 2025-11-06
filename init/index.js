const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
const data = require("./data.js");

main()
  .then((res) => {
    console.log(res);
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDb = async () => {
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "68fa6ea1905ff048a25ca9e9",
  }));
  await Listing.insertMany(initdata.data);
  console.log("data is insert");
  console.log(initdata.data);
};
initDb();


