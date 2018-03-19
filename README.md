# CA675 Assignment 1 -> Map Reduce Using NodeJS/Express/MongoDB/Mongoose

## David O'Regan -10331017

## Why not use AWS EMR

I had origonally tried to get a project set up on AWS EMR leveraging spark/a s3 bucket and a simple jar for data processing, but was unable to ssh into my Master/Slave instances and so could not run the needed operations.

Following this, I had turned to Google `dataproc` for running the spark instance, but again could not sucessfully gain ssh access to my cluster.

Given this, I opted to develop a local solution as the given sample set was small enough to run accross a MongoDB replica set -> 1 Master Node && 2 Slave Nodes.

I have attched a screen shot of my ssh issue to give an example, if there had of been a error message or something to debug I may have been able to get AWS/Google working in time but I wanted to make sure I was able to submit a working project rather than nothing.

The main technologies however remain the same for the project as I intended to use MongoDB for my data storage through AWS EMR/Google as its noSQL format works very well for large data queries: [https://www.mongodb.com/presentations/mongodb-and-aws-integrations](See description for linking here)

The following is an API reference for mongoDB mapReduce which I followed for this project: [https://docs.mongodb.com/manual/reference/method/db.collection.mapReduce/](<db.collection.mapReduce())

### Tasks Completed With File Names

* Collect 200,00 Posts from StackExhange: `assets/Query.text`
* Transform data to workable state: `assets/mergedQueries.csv -> mongoDB/posts`(CSV File loader included via UI)
  * For this task, I used `fast-csv` to stream my CSV file and then transform the data via a schema: `db/models/Post.js` for processing to the mongoDB collection.
* The top 10 posts by score: `db/modules/getTop10Posts`
* The top 10 users by post score: `db/modules/getTop10UsersByScore`
* The number of distinct users, who used the word ‘hadoop’ in one of their posts: `db/modules/mapHadoop`
* Using mapreduce calculate the per-user TF-IDF: `db/modules/tfidf` -> First attempt done using Raw JS(`scripts/modules/tfidf`)

### Tasks Not Completed:

* Bonus use EMR to execute one or more of these tasks (if so, provide logs / screenshots) (worth 1 extra point per task 2-4, note that the three queries from point 3 are worth 1 point.)

### Installation

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
*
