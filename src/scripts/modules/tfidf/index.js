function TFIDF() {}

TFIDF.prototype.weights = function(docs, term) {
  const currentIdf = this.idf(docs, term);

  return docs.map(doc => {
    const currentTf = this.tf(doc, term);
    const tfidf = currentTf * currentIdf;

    return { weight: tfidf, OwnerUserId: doc.OwnerUserId };
  });
};

TFIDF.prototype.tf = function(words, term) {
  let count = 0;

  const values = Object.values(words);

  values.forEach(valueEL => {
    if (valueEL.indexOf(term) !== -1) {
      return count++;
    }
  });

  return count / values.length;
};

TFIDF.prototype.idf = function(docs, term) {
  let count = 0;
  docs.forEach(element => {
    const values = Object.values(element);

    values.forEach(valueEL => {
      if (valueEL.indexOf(term) !== -1) {
        return count++;
      }
    });
  });

  if (count == 0) {
    return undefined;
  }

  return (docs.length / count);
};

TFIDF.prototype.wordExisits = function(doc, term) {
  return doc.find(element => {
    return element.includes(term);
  });
};

export default TFIDF;
