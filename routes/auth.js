const express = require("express")
const router = express.Router()
const router2 = express.Router()

router.get("/", function (req, res) {
    res.render(__dirname + "/../views/login.ejs", {domain: process.env.DOMAIN})
})

router2.get("/", function (req, res) {
    res.render(__dirname + "/../views/register.ejs", {domain: process.env.DOMAIN})
})

module.exports.login = router
module.exports.register = router2