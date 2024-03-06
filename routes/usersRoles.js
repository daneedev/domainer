const express = require("express")
const router = express.Router()
const { checkAuth, checkAdmin } = require("../handlers/checkAuth")
const User = require("../models/User")
const router2 = express.Router()
const Role = require("../models/Role")
const router3 = express.Router()
const router4 = express.Router()
const router5 = express.Router()
const router6 = express.Router()
const bcrypt = require("bcrypt")
const Subdomain = require("../models/Subdomain")
const sanitize = require("sanitize-filename")

router.post("/", checkAuth, checkAdmin, async function (req, res) {
    const findUser = await User.findOne({where:{username: req.body.username}})
    if (!findUser) {
        req.flash("adminerror", "That user doesn't exist!")
        res.redirect("/admin")
    } else {
        await User.destroy({where:{username: req.body.username}})
        res.redirect("/admin")
    }
})

router2.get("/", checkAuth, checkAdmin, async function (req, res) {
    const username = req.query.username
    const roles = await Role.findAll()
    res.render(__dirname + "/../views/changerole.ejs", {username: username, roles: roles})
})

router2.post("/", checkAuth, checkAdmin, async function (req, res) {
    const username = req.body.username
    const role = req.body.role
    const findUser = await User.findOne({where:{username: username}})
    const findRole = await Role.findOne({where:{name: role}})
    if (!findUser || !findRole) {
        req.flash("adminerror", "That user or role doesn't exist!")
        res.redirect("/admin")
    } else {
        findUser.role = role
        findUser.save()
        res.redirect("/admin")
    }
})

router3.post("/", checkAuth, checkAdmin, async function (req, res) {
    const role = req.body.role
    const findRole = await Role.findOne({where:{name: role}})
    if (!findRole) {
        req.flash("adminerror", "That role doesn't exist!")
        res.redirect("/admin")
    } else {
        const findUsers = await User.findAll({where:{role: role}})
        if (findUsers.length > 0) {
            req.flash("adminerror", "There are still users with that role!")
            res.redirect("/admin")
        } else {
            await Role.destroy({where:{name: role}})
            res.redirect("/admin")
        }
    }
})

router4.get("/", checkAuth, checkAdmin, async function (req, res) {
    const role = sanitize(req.query.role)
    const findRole = await Role.findOne({where:{name: role}})
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
    const findRole = await Role.findOne({where:{name: role}})
    const findUsers = await User.findOne({where:{role: role}})
    if (!findRole) {
        req.flash("adminerror", "That role doesn't exist!")
        res.redirect("/admin")
    } else if (findUsers) {
        req.flash("adminerror", "There are still users with that role!")
        res.redirect("/admin")
    } else {
        findRole.name = newname
        findRole.maxSubdomains = maxSubdomains
        findRole.save()
        res.redirect("/admin")
    }
})

router5.get("/", checkAuth, checkAdmin, async function (req, res) {
    res.render(__dirname + "/../views/addrole.ejs", {})
})

router5.post("/", checkAuth, checkAdmin, async function (req, res) {
    const name = req.body.role
    const maxSubdomains = req.body.maxSubdomains
    const findRole = await Role.findOne({where:{name: name}})
    if (findRole) {
        req.flash("adminerror", "That role already exists!")
        res.redirect("/admin")
    } else {
       Role.create({
            name: name,
            maxSubdomains: maxSubdomains,
            default: false
        })
        res.redirect("/admin")
    }
})

router6.get("/", checkAuth, async function (req, res) {
    const user = await User.findOne({where:{username: req.user.username}})
    res.render(__dirname + "/../views/manage.ejs", {user: user})
})

router6.get("/edit", checkAuth, async function (req, res) {
    const user = await User.findOne({where:{username: req.user.username}})
    res.render(__dirname + "/../views/edituser.ejs", {user: user, message: req.flash("editerror")})
})

router6.post("/edit", checkAuth, async function (req, res) {
    const findUser = await User.findOne({where:{username: req.body.username}})
    if (findUser) {
        req.flash("editerror", "That username is already taken!")
        res.redirect("/manage/edit")
    } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        findUser.username = req.body.username
        findUser.email = req.body.email
        findUser.password = hashedPassword
        findUser.save()
        await (await Subdomain.findAll({where:{owner: req.user.username}})).forEach((subdomain) => {
            subdomain.owner = req.body.username
            subdomain.save()
        })
        req.logOut()
        res.redirect("/login")
    }
})
module.exports.deleteUser = router
module.exports.changeRole = router2
module.exports.deleteRole = router3
module.exports.editRole = router4
module.exports.addRole = router5
module.exports.manage = router6