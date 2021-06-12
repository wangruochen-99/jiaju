let jwt = require("./jwt");

module.exports = (req, res, next) => {

    //处理公共参数
    //query
    req.query._page = req.query._page ? req.query._page - 1 : require("../config/query-ruls")._page;

    req.query._limit = req.query._limit ? req.query._limit - 0 : require("../config/query-ruls")._limit;

    req.query.q = req.query.q ? req.query.q : require("../config/query-ruls").q;

    req.query.sort = req.query.sort ? req.query.sort : require("../config/query-ruls").sort;

    //body
    req.body._page = req.body._page ? req.body._page - 1 : require("../config/query-ruls")._page;

    req.body._limit = req.body._limit ? req.body._limit - 0 : require("../config/query-ruls")._limit;

    req.body.q = req.body.q ? req.body.q : require("../config/query-ruls").q;

    //headers
    req.headers.sort = req.headers.sort ? req.headers.sort : require("../config/query-ruls").sort;

    req.headers._page = req.headers._page ? req.headers._page - 1 : require("../config/query-ruls")._page;

    req.headers._limit = req.headers._limit ? req.headers._limit - 0 : require("../config/query-ruls")._limit;

    req.headers.q = req.headers.q ? req.headers.q : require("../config/query-ruls").q;

    req.headers.sort = req.headers.sort ? req.headers.sort : require("../config/query-ruls").sort;

    // console.log("headers:", req.body.username);
    // console.log("headers:", req.headers);

    //处理token统一校验
    if (/login|register|logout/.test(req.url)) {
        next();
    } else {
        //获取token
        let token = req.query.token || req.headers.token || req.body.token;
        //校验token
        jwt.verify(token).then(decode => {
            //向下传递 明文token
            req.detoken = decode;
            next();
        }).catch(message => {
            //提示报错信息
            res.send({
                err: 2,
                msg: "token校验失败" + message
            });
        });
    }
}