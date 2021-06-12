let express = require("express");
let router = express.Router();
let pathObj = require("path");
let fs = require("fs");
let bcrypt = require("../../utils/bcrypt");
let mgodb = require("../../utils/mgodb");

router.post("/", (req, res, next) => {
    //获取用户传递的信息
    let { username, password, nikename } = req.body;

    //校验
    if (!username || !password) {
        res.send({
            err: 1,
            msg: "用户名和密码为必填项"
        });
        return;
    }

    //整理参数
    nikename = nikename || '只和树说话';
    let follow = 0;
    let fans = 0;
    //头像默认存储位置
    let icon = '/upload/user/default_icon.png';
    let time = Date.now();

    //接受传递过来的文件
    if (req.files && req.files.length > 0) {
        //改名，给图片增加后缀，覆盖默认头像
        fs.renameSync(
            req.files[0].path,
            req.files[0].path + pathObj.parse(req.files[0].originalname).ext
        )

        icon = "/upload/user/" + req.files[0].filename + pathObj.parse(req.files[0].originalname).ext
    }

    //开库
    mgodb.open({
        collectionName: "user"
    }).then(({
        collection, client
    }) => {
        collection.find({ username }).toArray((err, result) => {
            if (err) {
                res.send({
                    err: 1,
                    msg: "集合操作失败"
                });
                client.close();
            } else {
                if (result.length === 0) {
                    //加密
                    password = bcrypt.hashSync(password);
                    //入库
                    collection.insertOne({
                        username,
                        password,
                        nikename,
                        fans,
                        follow,
                        time,
                        icon
                    }, (err, result) => {
                        if (!err) {
                            delete result.ops[0].username;
                            delete result.ops[0].password;
                            res.send({
                                err: 0,
                                msg: "注册成功",
                                data: result.ops[0]
                            });
                        } else {
                            res.send({
                                err: 1,
                                msg: "注册失败"
                            });
                        }
                    });
                } else {
                    if (icon.indexOf('default') === -1) {
                        fs.unlinkSync("./public" + icon)
                    }
                    res.send({
                        err: 1,
                        msg: "用户名已存在"
                    });
                    client.close();
                }
            }

        });
    })
});

module.exports = router