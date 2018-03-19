const Post = require("../../models/Post");

/**
 * @name getTop10UsersByScore
 * @description use mapReduce to grab our top 10 users order by Post.Score
 * @param none
 *
 * @returns <fn> {any}
 */
const getTop10UsersByScore = function() {
  var o = {};
  o.map = function() {
    emit(this.OwnerUserId, this.Score);
  };
  o.reduce = function(k, vals) {
    return Array.sum(vals);
  };

  Post.mapReduce(o, function(err, results) {
    if (err) throw err;
    const data = results.results;

    const sorted = data.sort(function(a, b) {
      return b.value - a.value;
    });

    const top10 = sorted.slice(0, 10);

    console.log(`Top Users Sorted By Post.Score ${JSON.stringify(top10)}`);
  });
};

module.exports = getTop10UsersByScore;
