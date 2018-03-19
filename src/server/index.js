const express = require("express");
const routes = require("./routes");
const connection = require("./../db/connection");
const fileUpload = require("express-fileupload");
const app = express();
const port = 3000;
const getTop10Posts = require('../db/modules/getTop10Posts');
const getTop10UsersByScore = require('../db/modules/getTop10UsersByScore');
const mapHadoop = require('../db/modules/mapHadoop');
const tfidf = require('../db/modules/tfidf');

//getTop10Posts();
//getTop10UsersByScore();
//mapHadoop();
//tfidf();

connection
  .connect("mongodb://localhost/posts")
  .then(() => console.log("connection succesful"))
  .catch(err => console.error(err));

app.use(fileUpload());
app.use("/", routes);

app.listen(port, function() {
  console.log("Web Sever Is A Go");
});
