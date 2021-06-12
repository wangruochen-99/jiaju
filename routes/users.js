var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.all('/open', (req, res) => {
  var mgo = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017";

  mgo.connect(url, function (err, db) {
    if (err) res.send("连接报错");

    var dbo = db.db("wrc");
    dbo.collection("wrc").find({}).toArray(function (err, result) { // 返回集合中所有数据
      if (err) res.send("查询报错");
      console.log(result);
      db.close();
      res.end();
    });
  });
});

router.all("/bcry", (req, res) => {
  var bcrypt = require("../app");
  var hash = bcrypt.hashSync(用户传过来的明文密码, 加盐数);
  console.log(hash);
});

module.exports = router;
