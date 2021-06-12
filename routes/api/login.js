let express = require("express");
let router = express.Router();
let mgodb = require("../../utils/mgodb");
let jwt = require("../../utils/jwt");
let bcrypt = require("../../utils/bcrypt");

router.post('/', (req, res, next) => {
    //获取
    let { username, password } = req.body;

    //校验
    if (!username || !password) {
        res.send({
            err: 1,
            msg: "用户名密码为必传参数"
        })
        return;
    }

    //兜库
    mgodb.open({ collectionName: 'user' }).then(({
        collection,
        client
    }) => {
        //先查询用户名
        collection.find({ username }).toArray((err, result) => {
            if (err) {
                res.send({
                    err: 1,
                    msg: "查询数据失败"
                });
            } else {
                if (result.length > 0) {
                    //校验入库的密码是否和传递过来的密码一致
                    let bl = bcrypt.compareSync(password, result[0].password);
                    if (bl) {
                        //登录成功后，需要将token返回给浏览器
                        let token = jwt.sign({ username, _id: result[0], password });
                        delete result[0].username;
                        delete result[0].password;
                        res.send({
                            err: 0,
                            msg: "登录成功",
                            data: result[0],
                            token: token
                        });
                    } else {
                        res.send({
                            err: 2,
                            msg: "用户名或密码不正确"
                        });
                        client.close();
                    }
                    client.close();
                } else {
                    res.send({
                        err: 3,
                        msg: "此用户不存在"
                    });
                    client.close();
                }
            }
        });
    });
});

module.exports = router;