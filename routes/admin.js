const express = require('express');
const { checkAdmin, checkAuth, checkSetup } = require('../handlers/checkAuth');
const router = express.Router();
const router2 = express.Router()
const router3 = express.Router()
const router4 = express.Router()
const Subdomain = require("../models/Subdomain")
const cf = require("../server").cf
const axios = require("axios")
const Stats = require("../models/stats")
const updateStats = require("../handlers/updateStats")
const User = require("../models/User")

router.get("/", checkSetup, checkAuth, checkAdmin, async function (req, res) {
    const subdomains = await Subdomain.find().sort({status: 1})
    const latestversion = await axios.get("https://version.daneeskripter.dev/domainer/version.txt").then((res) => {return res.data})
    const stats = await Stats.findOne()
    const currentversion = require("../package.json").version
    const users = await User.find()
    updateStats()
    res.render(__dirname + "/../views/admin.ejs", {subdomains: subdomains, message: req.flash("adminerror"), stats: stats, latestversion: latestversion, currentversion: currentversion, users: users})
})

router2.post("/", checkSetup, checkAuth, checkAdmin, async function (req, res) {
    const findSubdomain = await Subdomain.findOne({subdomain: req.body.subdomain})
    if (findSubdomain) {
        if (findSubdomain.status == 2) {
            req.flash("adminerror", "That subdomain is already approved!")
            res.redirect("/admin")
        } else {
            await Subdomain.updateOne({subdomain: req.body.subdomain}, {status: 2})
            cf.dnsRecords.add(process.env.CLOUDFLARE_ZONE_ID, {
                type: findSubdomain.recordType,
                name: findSubdomain.subdomain,
                content: findSubdomain.pointedTo,
                ttl: 1,
                proxied: false,
                proxiable: true,
                locked: false

            })
            res.redirect("/admin")
        }
    } else {
        req.flash("adminerror", "That subdomain doesn't exist!")
        res.redirect("/admin")
    }
})

router3.post("/", checkSetup, checkAuth, checkAdmin, async function (req, res) {
    const findSubdomain = await Subdomain.findOne({subdomain: req.body.subdomain})
    if (findSubdomain) {
        if (findSubdomain.status == 0) {
            req.flash("adminerror", "That subdomain is already declined!")
            res.redirect("/admin")
        } else {
            await Subdomain.updateOne({subdomain: req.body.subdomain}, {status: 0})
            if (findSubdomain.status == 2) {
            cf.dnsRecords.browse(process.env.CLOUDFLARE_ZONE_ID).then((data) => {
                const recordid = data.result.find(record => record.name == findSubdomain.subdomain).id
                cf.dnsRecords.del(process.env.CLOUDFLARE_ZONE_ID, recordid)
            })
            }
            res.redirect("/admin")
        }
    } else {
        req.flash("adminerror", "That subdomain doesn't exist!")
        res.redirect("/admin")
    }
})

router4.post("/", checkSetup, checkAuth, checkAdmin, async function (req, res) {
    const findSubdomain = await Subdomain.findOne({subdomain: req.body.subdomain})
    if (findSubdomain) {
        if (findSubdomain.status == 1) {
            req.flash("adminerror", "That subdomain is already in review!")
            res.redirect("/admin")
        } else {
            await Subdomain.updateOne({subdomain: req.body.subdomain}, {status: 1})
            if (findSubdomain.status == 2) {
                cf.dnsRecords.browse(process.env.CLOUDFLARE_ZONE_ID).then((data) => {
                    const recordid = data.result.find(record => record.name == findSubdomain.subdomain).id
                    cf.dnsRecords.del(process.env.CLOUDFLARE_ZONE_ID, recordid)
                })
                }
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