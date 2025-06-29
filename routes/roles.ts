import express from "express";
import { checkAuth, checkAdmin, checkSetup } from "../handlers/checkAuth";
import User from "../models/User";
import Role from "../models/Role";
import sanitize from "sanitize-filename";

const router = express.Router();

router.get("/change", checkAuth, checkAdmin, async function (req, res) {
    const username = req.query.username
    const roles = await Role.findAll()
    res.render("edit/changerole.html", {username: username, roles: roles})
})

router.post("/change", checkAuth, checkAdmin, async function (req, res) {
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

router.post("/delete", checkAuth, checkAdmin, async function (req, res) {
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

router.get("/edit", checkAuth, checkAdmin, async function (req, res) {
    const role = sanitize(req.query.role as string)
    const findRole = await Role.findOne({where:{name: role}})
    if (!findRole) {
        req.flash("adminerror", "That role doesn't exist!")
        res.redirect("/admin")
    } else {
        res.render("edit/editrole.html", {role: role})
    }
})

router.post("/edit", checkAuth, checkAdmin, async function (req, res) {
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

router.get("/add", checkAuth, checkAdmin, async function (req, res) {
    res.render("edit/addrole.html", {})
})

router.post("/add", checkAuth, checkAdmin, async function (req, res) {
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

export default router;