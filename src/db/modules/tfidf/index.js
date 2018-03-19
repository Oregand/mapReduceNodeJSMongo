const Post = require("../../models/Post");

/**
 * @name tf
 * @description Individual word occurance weight
 * @param {any} term
 * @param {any} idf
 *
 * @returns <fn> {Any}
 */
const tf = (term, idf) => {
  var o = {};
  o.map = function(idf) {
    var occurrence = 0;
    const words = this.Body.split(" ");
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      if (word.indexOf(term) != -1) {
        occurrence += 1;
      }
    }
    var weight = idf * (occurrence / words.length);
    emit(this, weight);
  };
  o.reduce = function(k, vals) {
    return vals;
  };

  Post.mapReduce(o, function(err, results) {
    if (err) throw err;
    const data = results.results;

    console.log("tf", data);

    return data.toArray();
  });
};

/**
 * @name idf
 * @description Individual word occurance weight
 * @param {any} term
 *
 * @returns <Number> {Number}
 */
const idf = term => {
  var o = {};
  o.map = function(term) {
    var occurrence = 0;
    const words = this.Body.split(" ");

    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      if (word.indexOf(term) != -1) {
        if (occurrence <= 0) {
          occurrence = 1;
        }
      }
    }
    emit(this.OwnerUserId, occurrence);
  };
  o.reduce = function(k, vals) {
    var result = { count: vals.length, occurrence: 0 };
    for (var i = 0; i < vals.length; i++) {
      if (vals[i] == 1) {
        result.occurrence += 1;
      }
    }
    return result;
  };

  Post.mapReduce(o, function(err, results) {
    if (err) throw err;
    const data = results.results;
    console.log("idf", data);
    if (
      data.value === undefined ||
      data.value === 0 ||
      data.value.occurrence == 0
    )
      return;
    const idf = Math.log(data.value[0].count / data.value[0].occurrence);
    return idf;
  });
};

/**
 * @name tfidf
 * @description use mapReduce calculate the per-user TF-IDF
 * top 10 terms for each user
 * @param none
 *
 * @returns <fn> {Any}
 */
const tfidf = function() {
  const term = "hadoop";

  idf(term, (err, idf) => {
    tf(term, idf, (err, documents) => {
      console.log("docs", documents);
    });
  });
};

module.exports = tfidf;
