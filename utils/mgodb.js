let mgodb = require("mongodb");
let mgoCt = mgodb.MongoClient;
//转换为mongodb数据库id的类型
let ObjectId = mgodb.ObjectId;

let sql = "wrc";

let open = ({
    dbName = sql,
    collectionName,
    url = "mongodb://127.0.0.1:27017"
}) => {
    return new Promise((resolve, reject) => {
        mgoCt.connect(url, { useUnifiedTopology: true }, (err, client) => {
            if (err) {
                reject(err.message);
            } else {
                let db = client.db(dbName);
                let collection = db.collection(collectionName);
                resolve({
                    collection, client, ObjectId
                });
            }
        });
    });
}

//获取列表
let findList = ({
    collectionName,
    dbName = sql,
    _page, _limit, q, _sort
}) => {
    let rule = q ? { title: eval('/' + q + '/') } : {};

    return new Promise((resolve, reject) => {
        //连接库
        open({
            dbName, collectionName
        }).then(
            ({ collection, client }) => {
                //查询
                collection.find(rule, {
                    //跳过
                    skip: _page * _limit,
                    //限定
                    limit: _limit,
                    //规定要显示的列
                    projection: {},
                    //单key的排序
                    sort: { [_sort]: -1 }
                }).toArray((err, result) => {
                    if (!err && result.length > 0) {
                        //判断查询成功，且数据不为零
                        resolve({
                            //调用外面的then，将数据传出去
                            err: 0,
                            data: result
                        });
                    } else {
                        resolve({
                            err: 1,
                            msg: "暂无数据"
                        });
                    }
                    client.close();
                });
            }
        ).catch(err => {
            reject({
                err: 1,
                msg: err
            });
            client.close();
        });
    });
}

//查询详情
let findDetail = ({
    collectionName,
    dbName = sql,
    _id = null
}) => {
    return new Promise((resolve, reject) => {
        //链接库
        open({
            dbName,
            collectionName
        }).then(({
            collection,
            client
        }) => {
            //查询
            //判断id 的长度
            if (_id.length === 24) {
                collection.find(
                    { _id: ObjectId(_id) }
                    // ,{ projection: { _id: 0 } }
                ).toArray((err, result) => {
                    if (result.length > 0) {
                        resolve({
                            err: 0,
                            data: result[0]//通过id查询到的结果是个对象，result是个数组
                        })
                    } else {
                        resolve({
                            err: 1,
                            msg: '查无数据'
                        })
                        //4.关闭库链接
                        client.close();
                    }
                })
            } else {
                reject({
                    err: 1,
                    msg: 'id有误'
                })
                client.close();
            }
        }).catch(err => {
            reject({
                err: 1,
                msg: "操作数据库失败"
            });
            client.close();
        });
    });
}

exports.open = open;
exports.findList = findList;
exports.findDetail = findDetail;