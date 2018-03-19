const csv = require("fast-csv");
const mongoose = require("mongoose");
const Post = require("../../../db/models/Post");

exports.post = (req, res) => {
  if (!req.files) return res.status(400).send("No files were uploaded.");

  const postFile = req.files.file;

  console.log(postFile);

  const posts = [];

  csv
    .fromString(postFile.data.toString(), {
      headers: true,
      ignoreEmpty: true
    })
    .on("data", data => {
      data.id = new mongoose.Types.ObjectId();
      console.log(data);
      posts.push(data);
    })
    .on("end", () => {
      console.log(posts);
      Post.create(posts, (err, documents) => {
        if (err) throw err;
      });

      res.send(posts.length + " posts have been successfully uploaded.");
    });
};
