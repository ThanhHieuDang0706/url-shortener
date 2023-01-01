const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl.js");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URL || "", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();

  res.render("index", { urls: shortUrls });
});

app.post("/short-url", async (req, res) => {
  await ShortUrl.create({
    full: req.body.fullUrl,
  });
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const url = await ShortUrl.findOne({
    short: req.params.shortUrl,
  });

  if (url) {
    url.clicks++;
    url.save();
    res.redirect(url.full);
  } else {
    res.redirect("/");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${process.env.PORT || 3000}`);
});
