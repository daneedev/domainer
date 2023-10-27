const express = require("express")
const router = express.Router()
const { checkAuth, checkAdmin } = require("../handlers/checkAuth")
const User = require("../models/User")
const router2 = express.Router()
const Role = require("../models/Role")

router.post("/", checkAuth, checkAdmin, async function (req, res) {
    const findUser = await User.findOne({username: req.body.username})
    if (!findUser) {
        req.flash("adminerror", "That user doesn't exist!")
        res.redirect("/admin")
    } else {
        await User.deleteOne({username: req.body.username})
        res.redirect("/admin")
    }
})

router2.get("/", checkAuth, checkAdmin, async function (req, res) {
    const username = req.query.username
    const roles = await Role.find()
    res.render(__dirname + "/../views/changerole.ejs", {username: username, roles: roles})
})

router2.post("/", checkAuth, checkAdmin, async function (req, res) {
    const username = req.body.username
    const role = req.body.role
    const findUser = await User.findOne({username: username})
    const findRole = await Role.findOne({name: role})
    if (!findUser || !findRole) {
        req.flash("adminerror", "That user or role doesn't exist!")
        res.redirect("/admin")
    } else {
        await User.updateOne({username: username}, {role: role})
        res.redirect("/admin")
    }
})

module.exports.deleteUser = router
module.exports.changeRole = router2