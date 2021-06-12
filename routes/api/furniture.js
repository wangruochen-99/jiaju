let express = require("express");
let router = express.Router();
let mgodb = require("../../utils/mgodb");

router.post('/', (req, res, next) => {
    console.log(req.body);
    //查询 处理 返回
    let collectionName = req.body.name;
    let { _page, _limit, _sort, q } = req.query;
    mgodb.findList({
        _page, _limit, q, _sort, collectionName
    }).then(result => {
        res.send(result);
    }).catch(err => {
        res.send(err);
    });
});

//新闻详情
router.get("/:name/:_id", (req, res, next) => {
    //查询 处理 返回
    let collectionName = req.params.name;
    let _id = req.params._id;

    mgodb.findDetail({
        collectionName, _id
    }).then(result => {
        res.send(result);
    }).catch(err => {
        res.send(err);
    });
});

module.exports = router;