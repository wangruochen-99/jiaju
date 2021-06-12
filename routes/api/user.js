let express = require("express");
let mgodb = require("../../utils/mgodb");
let router = express.Router();
let fs = require("fs");
let pathObj = require("path");
let mongodb = require('mongodb');
let ObjectId = mongodb.ObjectId

router.get("/", (req, res, next) => {
    mgodb.open({ collection: "user" }).then(({ collection, client, ObjectId }) => {
        //根据token携带的id和用户名查询是否存在
        collection.find({ username: req.detoken.username, _id: ObjectId(req.detoken._id) }).toArray((err, result) => {
            if (err) {
                res.send({
                    err: 1,
                    msg: "集合操作失败"
                });
            } else {
                if (result.length > 0) {
                    delete result[0].username;
                    delete result[0].password;
                    res.send({
                        err: 0,
                        msg: "成功",
                        data: result[0]
                    });
                } else {
                    res.send({
                        err: 1,
                        msg: "自动登录失败"
                    });
                }
            }
            client.close();
        });
    })
});

router.post("/uploadFile", (req, res, next) => {
    let { _id, collectionName } = req.body;

    //改名，给图片增加后缀，更换头像
    fs.renameSync(
        req.files[0].path,
        req.files[0].path + pathObj.parse(req.files[0].originalname).ext
    )
    let icon = "/upload/user/" + req.files[0].filename + pathObj.parse(req.files[0].originalname).ext

    _id = ObjectId(_id);
    //开库
    mgodb.open({
        collectionName
    }).then(({
        collection, client
    }) => {
        // updateOne({ 条件 }, { 更新后 }, (err, res) => { })

        collection.find({ _id }).toArray((err, result) => {
            if (err) {
                res.send({
                    err: 1,
                    msg: "查询集合失败"
                });
                client.close();
            } else {
                collection.updateOne(
                    { _id: _id },
                    { $set: { "icon": icon } },
                    (err, result) => {
                        if (err) {
                            res.send({
                                err: 2,
                                msg: "操作集合失败"
                            });
                            client.close();
                        } else {
                            res.send({
                                err: 0,
                                msg: "操作成功",
                                icon: icon
                            });
                            client.close();
                        }
                    });
                // if (result.length > 0) {
                //     console.log(result);
                //     collection.updateOne(icon).then(
                //         (res, er) => {
                //             if (er) {
                //                 res.send({
                //                     err: 3,
                //                     msg: "修改操作失败"
                //                 });
                //             } else {
                //                 res.send({
                //                     err: 0,
                //                     msg: "操作成功",
                //                     data: result[0]
                //                 });
                //             }
                //             client.close();
                //         }
                //     );
                // } else {
                //     res.send({
                //         err: 2,
                //         msg: "未查询到用户"
                //     });
                //     client.close();
                // }
            }
        })
    })
})

module.exports = router;