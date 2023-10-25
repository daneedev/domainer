const express = require('express');
const router = express.Router();

router.get("/", function (req, res) { 
    res.render(__dirname + "/../views/index.ejs", {domain: process.env.DOMAIN})
})

module.exports = router;