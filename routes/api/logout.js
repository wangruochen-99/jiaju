let express = require('express');

let router = express.Router();

router.get("/", (req, res, next) => {
    console.log("logout");
    next();
});

module.exports = router;