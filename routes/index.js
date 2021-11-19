var express = require("express");
var router = express.Router();
const { v4: uuidV4 } = require("uuid");

router.get("/", (req, res) => {
  console.log("jayden", "render");
  // res.redirect(`/${uuidV4()}`);
  res.render("index");
});

router.get("/:room", (req, res) => {
  res.render("index", { roomId: req.params.room });
});

module.exports = router;
