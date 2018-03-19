const Post = require("../../models/Post");

/**
 * @name mapHadoop
 * @description use mapReduce to grab distinct users, who used the word ‘hadoop’ in one of their posts
 * @param none
 *
 * @returns <fn> {any}
 */
const mapHadoop = function() {
  const o = {};

  o.map = function() {
    emit({ OwnerUserId: this.OwnerUserId }, { body: this.Body });
  };
  o.reduce = function(k, vals) {
    var count = 0;

    vals.forEach(function(val) {
      if (val.indexOf("hadoop") !== -1) count++;
    });

    return { count: count };
  };

  Post.mapReduce(o, function(err, results) {
    if (err) throw err;
    const data = results.results;

    console.log(
      `The number of distinct users, who used the word hadoop in one of their post ${JSON.stringify(
        data
      )}`
    );
  });
};

module.exports = mapHadoop;
