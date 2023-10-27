const express = require("express")
const router = express.Router()
const { checkAuth, checkAdmin } = require("../handlers/checkAuth")
const User = require("../models/User")
const router2 = express.Router()
const Role = require("../models/Role")
const router3 = express.Router()
const router4 = express.Router()

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

router3.post("/", checkAuth, checkAdmin, async function (req, res) {
    const role = req.body.role
    const findRole = await Role.findOne({name: role})
    if (!findRole) {
        req.flash("adminerror", "That role doesn't exist!")
        res.redirect("/admin")
    } else {
        const findUsers = await User.find({role: role})
        if (findUsers.length > 0) {
            req.flash("adminerror", "There are still users with that role!")
            res.redirect("/admin")
        } else {
            await Role.deleteOne({name: role})
            res.redirect("/admin")
        }
    }
})

router4.get("/", checkAuth, checkAdmin, async function (req, res) {
    const role = req.query.role
    const findRole = await Role.findOne({name: role})
    if (!findRole) {
        req.flash("adminerror", "That role doesn't exist!")
        res.redirect("/admin")
    } else {
        res.render(__dirname + "/../views/editrole.ejs", {role: role})
    }
})

router4.post("/", checkAuth, checkAdmin, async function (req, res) {
    const role = req.body.role
    const maxSubdomains = req.body.maxSubdomains
    const newname = req.body.name
    const findRole = await Role.findOne({name: role})
    const findUsers = await User.findOne({role: role})
    if (!findRole) {
        req.flash("adminerror", "That role doesn't exist!")
        res.redirect("/admin")
    } else if (findUsers) {
        req.flash("adminerror", "There are still users with that role!")
        res.redirect("/admin")
    } else {
        await Role.updateOne({name: role}, {name: newname, maxSubdomains: maxSubdomains})
        res.redirect("/admin")
    }
})

module.exports.deleteUser = router
module.exports.changeRole = router2
module.exports.deleteRole = router3
module.exports.editRole = router4