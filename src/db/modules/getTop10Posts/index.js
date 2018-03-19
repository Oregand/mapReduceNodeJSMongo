const Post = require("../../models/Post");

/**
 * @name getTop10Posts
 * @description use mapReduce to grab our top 10 posts via Post.Score
 * @param none
 *
 * @returns <fn> {any}
 */
const getTop10Posts = function() {
  var o = {};
  o.map = function() {
    emit("Score", this.Score);
  };
  o.reduce = function(k, vals) {
    return vals;
  };

  Post.mapReduce(o, function(err, results) {
    if (err) throw err;
    const data = results.results;

    const sorted = data.sort(function(a, b) {
      return b.value - a.value;
    });
    
    const top10 = sorted.slice(0, 10);

    console.log(`Top 10 Posts Sorted By Post.Score ${JSON.stringify(top10)}`);
  });
};

module.exports = getTop10Posts;
