const express = require("express")
const router = express.Router()
const router2 = express.Router()
const router3 = express.Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")
const passport = require("passport")
const { checkNotAuth } = require("../handlers/checkAuth")

router.get("/", checkNotAuth, function (req, res) {
    res.render(__dirname + "/../views/login.ejs", {domain: process.env.DOMAIN, message: req.flash('error') })
})

router.post("/", checkNotAuth, passport.authenticate("local", {
    successRedirect: "/dash",
    failureRedirect: '/login',
    failureFlash: true
}))

router2.get("/", checkNotAuth, function (req, res) {
    res.render(__dirname + "/../views/register.ejs", {domain: process.env.DOMAIN})
})

router2.post("/", checkNotAuth, async function (req, res) {
    const findUser = await User.findOne({username: req.body.username})
    if (findUser) {

    } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = new User({
            username: req.body.username,
            password: hashedPassword,
            isAdmin: false
        })
        newUser.save().then(() => {
            res.redirect("/login")
        })
    }
})

router3.post("/", function (req, res) {
    req.logOut()
    res.redirect("/")
})

module.exports.login = router
module.exports.register = router2
module.exports.logout = router3