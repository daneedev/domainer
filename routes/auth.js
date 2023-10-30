const express = require("express")
const router = express.Router()
const router2 = express.Router()
const router3 = express.Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")
const passport = require("passport")
const { checkNotAuth, checkSetup, checkAuth } = require("../handlers/checkAuth")
const Role = require("../models/Role")

router.get("/", checkSetup, checkNotAuth, function (req, res) {
    res.render(__dirname + "/../views/login.ejs", {domain: process.env.DOMAIN, message: req.flash('error') })
})

router.post("/", checkSetup, checkNotAuth, passport.authenticate("local", {
    successRedirect: "/dash",
    failureRedirect: '/login',
    failureFlash: true
}))

router2.get("/", checkSetup, checkNotAuth, function (req, res) {
    res.render(__dirname + "/../views/register.ejs", {domain: process.env.DOMAIN, message: req.flash('error')})
})

router2.post("/", checkSetup, checkNotAuth, async function (req, res) {
    const findUser = await User.findOne({username: req.body.username})
    if (findUser) {
        req.flash("error", "That username is already taken!")
        res.redirect("/register")
    } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const role = await Role.findOne({default: true}).name
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            isAdmin: false,
            role: role,
            subdomainsCount: 0
        })
        newUser.save().then(() => {
            res.redirect("/login")
        })
    }
})

router3.post("/", checkSetup, checkAuth, function (req, res) {
    req.logOut()
    res.redirect("/")
})

module.exports.login = router
module.exports.register = router2
module.exports.logout = router3