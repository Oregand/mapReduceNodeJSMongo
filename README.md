# CA675 Assignment 1 -> Map Reduce Using NodeJS/Express/MongoDB/Mongoose

## David O'Regan -10331017

## Why not use AWS EMR

I had origonally tried to get a project set up on AWS EMR leveraging spark/a s3 bucket and a simple jar for data processing, but was unable to ssh into my Master/Slave instances and so could not run the needed operations.

![SSH Issue](/src/assets/img/ssh-issue.png "SSH Issue")

Following this, I had turned to Google `dataproc` for running the spark instance, but again could not sucessfully gain ssh access to my cluster.

Given this, I opted to develop a local solution as the given sample set was small enough to run accross a MongoDB replica set -> 1 Master Node && 2 Slave Nodes.

I have attched a screen shot of my ssh issue to give an example, if there had of been a error message or something to debug I may have been able to get AWS/Google working in time but I wanted to make sure I was able to submit a working project rather than nothing.

The main technologies however remain the same for the project as I intended to use MongoDB for my data storage through AWS EMR/Google as its noSQL format works very well for large data queries: [https://www.mongodb.com/presentations/mongodb-and-aws-integrations](See description for linking here)

The following is an API reference for mongoDB mapReduce which I followed for this project: [https://docs.mongodb.com/manual/reference/method/db.collection.mapReduce/](<db.collection.mapReduce())

### Tasks Completed With File Names

* Collect 200,00 Posts from StackExhange: `assets/Query.text`

The collection of data was done using the stack exhange query API. I was able to start by attaining the first 50,000 posts with a view count of `> 58000`, and from there could work backwards until I had a minimum of 200,000 posts with no duplication.

```mysql
select count(*) from posts where posts.ViewCount >  58000

select * from posts where posts.ViewCount >  58000

select count(*) from posts where posts.ViewCount> 36000 and posts.ViewCount < 58000

select * from posts where posts.ViewCount> 36000 and posts.ViewCount < 58000

select count(*) from posts where posts.ViewCount> 27000 and posts.ViewCount < 36000

select * from posts where posts.ViewCount> 27000 and posts.ViewCount < 36000

select count(*) from posts where posts.ViewCount> 21500 and posts.ViewCount < 27000

select * from posts where posts.ViewCount> 21500 and posts.ViewCount < 27000

cat *.csv > mergedQueries.csv
```

* Transform data to workable state: `assets/mergedQueries.csv -> mongoDB/posts`
  * First I merged the 4 seperate CSV files using the `cat` command for a single `.csv`
  * Next, I used `fast-csv` to stream my CSV file and then transform the data via a schema: `db/models/Post.js` for processing to the mongoDB collection.
  * Once this schema was loaded into my `posts` collection, I was read to start with `mapReduce`.
  * I also created a small file upload feature through the UI which would allow me to easily upload a new `.csv` to my DB should I need to: `scripts/modules/upload`

```js
// create a post schema
const postSchema = new Schema({
  Id: Number,
  PostTypeId: Number,
  AcceptedAnswerId: Number,
  ParentId: String,
  CreationDate: String,
  DeletionDate: String,
  Score: Number,
  ViewCount: Number,
  Body: String,
  OwnerUserId: Number,
  OwnerDisplayName: String,
  LastEditorUserId: String,
  LastEditorDisplayName: String,
  LastEditDate: String,
  LastActivityDate: String,
  Title: String,
  Tags: String,
  AnswerCount: Number,
  CommentCount: Number,
  FavoriteCount: Number,
  ClosedDate: String,
  CommunityOwnedDate: String
});
```

### MongoDB MapReduce API

```js
/**
 * @name Model.mapReduce
 * @description In this map-reduce operation, MongoDB applies the map phase to each input document (i.e. the documents in the collection that * match the query condition). The map function emits key-value pairs. For those keys that have multiple values, MongoDB applies the reduce
 * @param none
 *
 * @returns <Array> {Objects}
 */

Model.mapReduce(
  map =>
    function() {
      emit(this._id, this.Score);
    },
  reduce =>
    function(key, vals) {
      Array.sum(vals);
    }
);
```

#### Please see code appendix for attached functions

* The top 10 posts by score: `db/modules/getTop10Posts`
  * ![Get top 10 posts by post score](/src/assets/img/getTop10PostsByScore.png "Get top 10 posts by post score")
* The top 10 users by post score: `db/modules/getTop10UsersByScore`
  * ![Get top 10 users by post score](/src/assets/img/getTop10UsersByPostScore.png "Get top 10 users by post score")
* The number of distinct users, who used the word ‘hadoop’ in one of their posts: `db/modules/mapHadoop`
  * ![Hadoop term distinct users](/src/assets/img/getHadoopDistinctUsers.png "Hadoop term distinct users")
  * Ans: `187`

### Tasks Not Completed

* Using mapreduce calculate the per-user TF-IDF: `db/modules/tfidf` -> First attempt done using Raw JS(`scripts/modules/tfidf`)
  * Not fully completed. Code attempted but I could not generate a correct result in time.
* Bonus use EMR to execute one or more of these tasks (if so, provide logs / screenshots) (worth 1 extra point per task 2-4, note that the three queries from point 3 are worth 1 point.)

### UI Scaffold For Uploading New CSV file

```bash
yarn install
```

### Start Dev Server

```bash
yarn start
```

### Build Prod Version

```bash
yarn run build
```

### MISC

* Results are provided from my current data set with screen shots attahced.

### Code Appendix

#### getTop10Posts

```js
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
    emit(this._id, this.Score);
  };
  o.reduce = function(k, vals) {
    const sorted = vals.sort(function(a, b) {
      return b.value - a.value;
    });

    const top10 = sorted.slice(0, 10);

    return { top10 };
  };

  Post.mapReduce(o, function(err, results) {
    if (err) throw err;
    const data = results.results;
    console.log(`Top 10 Posts Sorted By Post.Score ${JSON.stringify(top10)}`);
  });
};
```

#### getTop10UsersByScore

```js
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
```

#### mapHadoop

```js
/**
 * @name mapHadoop
 * @description use mapReduce to grab distinct users, who used the word ‘hadoop’ in one of their posts
 * Performs same query as db.posts.find({"Body" : {$regex : ".*hadoop.*"}}).count(); = 187
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
    const data = results.results.length;

    // 187
    console.log(
      `The number of distinct users, who used the word hadoop in one of their post ${data}`
    );
  });
};
```

#### TFIDF

```js
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
```
