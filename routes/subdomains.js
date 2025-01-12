const express = require("express")
const router = express.Router()
const router2 = express.Router()
const router3 = express.Router()
const Subdomain = require("../models/Subdomain")
const { checkAuth, checkSetup } = require("../handlers/checkAuth")
const RateLimit = require("express-rate-limit")
const sanitize = require("sanitize-filename")
const cf = require("../server").cf
const User = require("../models/User")
const Role = require("../models/Role")

router.get("/", checkSetup, checkAuth, async function (req, res) {
    res.render("edit/addsubdomain.html", {domain: process.env.DOMAIN, message: req.flash('domainerror')})
})

router.post("/", checkSetup, checkAuth, async function (req, res) {
    const findSubdomain = await Subdomain.findOne({where:{subdomain: req.body.subdomain}})
    if (findSubdomain) {
        req.flash("domainerror", "That subdomain already exists!")
        res.redirect("/add")
    } else if (!req.body.subdomain.includes(process.env.DOMAIN)) {
        req.flash("domainerror", `That subdomain doesn't contain ${process.env.DOMAIN}!`)
        res.redirect("/add")
    } else {
        const user = await User.findOne({where:{username: req.user.username}})
        const role = await Role.findOne({where:{name: user.role}})
        if (user.subdomainsCount >= role.maxSubdomains) {
            req.flash("domainerror", `You can't have more than ${role.maxSubdomains} subdomains!`)
            res.redirect("/add")
        } else {
        Subdomain.create({
            subdomain: req.body.subdomain,
            owner: req.user.username,
            pointedTo: req.body.pointedto,
            recordType: req.body.recordType,
            status: 1
        })
        const user = await User.findOne({username: req.user.username})
        user.subdomainsCount++
        user.save()
        res.redirect("/dash")
    }
    }
})

router2.post("/", checkSetup, checkAuth, async function (req, res) {
    const subdomain = req.body.subdomain
    const findSubdomain = await Subdomain.findOne({where:{subdomain: subdomain}})
    if (findSubdomain.owner != req.user.username) {
        res.redirect("/dash")
    } else {
        await Subdomain.destroy({where:{subdomain: subdomain}})
        const user = await User.findOne({where:{username: req.user.username}})
        user.subdomainsCount--
        user.save()
        if (findSubdomain.status == 2) {
            cf.dnsRecords.browse(process.env.CLOUDFLARE_ZONE_ID).then((data) => {
                const recordid = data.result.find(record => record.name == findSubdomain.subdomain).id
                cf.dnsRecords.del(process.env.CLOUDFLARE_ZONE_ID, recordid)
            })
        }
        res.redirect("/dash")
    }
})

router3.get("/", checkSetup, checkAuth, async function (req, res) {
    const subdomain = sanitize(req.query.subdomain)
    const findSubdomain = await Subdomain.findOne({where:{subdomain: subdomain}})
    if (findSubdomain.owner != req.user.username) {
        res.redirect("/dash")
    } else {
        res.render("edit/editsubdomain.html", {message: req.flash("editerror"), subdomain: subdomain})
    }
})

const editLimiter = RateLimit({
    windowMs: 5 * 60 * 1000,
    max: 500
})

router3.post("/", checkSetup, checkAuth, editLimiter, async function (req, res) {
    const subdomain = req.body.subdomain
    const findSubdomain = await Subdomain.findOne({where:{subdomain: subdomain}})
    if (findSubdomain.owner != req.user.username) {
        res.redirect("/dash")
    } else if (!req.body.subdomain.includes(process.env.DOMAIN)) {
        req.flash("editerror", `That subdomain doesn't contain ${process.env.DOMAIN}!`)
        res.redirect("/add")
    } else {
        const updateSubdomain = await Subdomain.findOne({where:{subdomain: subdomain}})
        updateSubdomain.pointedTo = req.body.pointedto
        updateSubdomain.recordType = req.body.recordType
        updateSubdomain.save()
        cf.dnsRecords.browse(process.env.CLOUDFLARE_ZONE_ID).then((data) => {
            const recordid = data.result.find(record => record.name == findSubdomain.subdomain).id
            cf.dnsRecords.edit(process.env.CLOUDFLARE_ZONE_ID, recordid, {
                type: req.body.recordType,
                name: findSubdomain.subdomain,
                content: req.body.pointedto,
                ttl: 1,
                proxied: false,
                proxiable: true,
                locked: false
            })
        })
        res.redirect("/dash")
    }
})

module.exports.add = router
module.exports.delete = router2
module.exports.edit = router3
