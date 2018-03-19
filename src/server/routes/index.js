const express = require("express");
const path = require("path");
const router = express.Router();
const appDir = path.dirname(require.main.filename);
const upload = require("../../scripts/modules/upload");

router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

router.get("/", function(req, res) {
  res.sendFile(appDir + "/index.html");
});

router.post("/", upload.post);

module.exports = router;
