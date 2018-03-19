const Post = require("../../models/Post");

/**
 * @name tfidf
 * @description use mapReduce calculate the per-user TF-IDF
 * top 10 terms for each user
 * @param none
 * 
 * @returns <fn> {any}
 */
const tfidf = function() {
  var o = {};
  o.map = function() {
    emit(this.OwnerUserId, this.Score);
  };
  o.reduce = function(k, vals) {
    return Array.sum(vals);
  };

  Post.mapReduce(o, function(err, results) {
    if (err) throw err;
    console.log(results.results);
  });
};

module.exports = tfidf;
