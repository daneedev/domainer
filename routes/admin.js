const express = require('express');
const { checkAdmin, checkAuth } = require('../handlers/checkAuth');
const router = express.Router();
const router2 = express.Router()
const router3 = express.Router()
const router4 = express.Router()
const Subdomain = require("../models/Subdomain")

router.get("/", checkAuth, checkAdmin, async function (req, res) {
    const subdomains = await Subdomain.find().sort({status: 1})
    res.render(__dirname + "/../views/admin.ejs", {subdomains: subdomains, message: req.flash("adminerror")})
})

router2.post("/", checkAuth, checkAdmin, async function (req, res) {
    const findSubdomain = await Subdomain.findOne({subdomain: req.body.subdomain})
    if (findSubdomain) {
        if (findSubdomain.status == 2) {
            req.flash("adminerror", "That subdomain is already approved!")
            res.redirect("/admin")
        } else {
            await Subdomain.updateOne({subdomain: req.body.subdomain}, {status: 2})
            res.redirect("/admin")
        }
    } else {
        req.flash("adminerror", "That subdomain doesn't exist!")
        res.redirect("/admin")
    }
})

router3.post("/", checkAuth, checkAdmin, async function (req, res) {
    const findSubdomain = await Subdomain.findOne({subdomain: req.body.subdomain})
    if (findSubdomain) {
        if (findSubdomain.status == 0) {
            req.flash("adminerror", "That subdomain is already declined!")
            res.redirect("/admin")
        } else {
            await Subdomain.updateOne({subdomain: req.body.subdomain}, {status: 0})
            res.redirect("/admin")
        }
    } else {
        req.flash("adminerror", "That subdomain doesn't exist!")
        res.redirect("/admin")
    }
})

router4.post("/", checkAuth, checkAdmin, async function (req, res) {
    const findSubdomain = await Subdomain.findOne({subdomain: req.body.subdomain})
    if (findSubdomain) {
        if (findSubdomain.status == 1) {
            req.flash("adminerror", "That subdomain is already in review!")
            res.redirect("/admin")
        } else {
            await Subdomain.updateOne({subdomain: req.body.subdomain}, {status: 1})
            res.redirect("/admin")
        }
    } else {
        req.flash("adminerror", "That subdomain doesn't exist!")
        res.redirect("/admin")
    }
})

module.exports.admin = router;
module.exports.approve = router2;
module.exports.decline = router3;
module.exports.review = router4;