let bcrypt = require("bcrypt");

module.exports = {
    //加密
    // hashSync: password => {
    //     bcrypt.hashSync(password, 10);
    // },
    hashSync: password => bcrypt.hashSync(password, 10),
    //比较
    compareSync: (password, hash) => {
        return bcrypt.compareSync(password, hash);
    }
};