const express = require("express")
const router = express.Router()
const router2 = express.Router()
const router3 = express.Router()
const Subdomain = require("../models/Subdomain")
const { checkAuth } = require("../handlers/checkAuth")
const { checkNotAuth } = require("../handlers/checkAuth")

router.get("/", checkAuth, async function (req, res) {
    res.render(__dirname + "/../views/addsubdomain.ejs", {domain: process.env.DOMAIN, message: req.flash('domainerror')})
})

router.post("/", checkAuth, async function (req, res) {
    const findSubdomain = await Subdomain.findOne({subdomain: req.body.subdomain})
    if (findSubdomain) {
        req.flash("domainerror", "That subdomain already exists!")
        res.redirect("/add")
    } else {
        const newSubdomain = new Subdomain({
            subdomain: req.body.subdomain,
            owner: req.user.username,
            pointedTo: req.body.pointedto,
            recordType: req.body.recordType,
            status: 1
        })
        newSubdomain.save().then(() => {
            res.redirect("/dash")
        })
    }
})

router2.post("/", checkAuth, async function (req, res) {
    const subdomain = req.body.subdomain
    const findSubdomain = await Subdomain.findOne({subdomain: subdomain})
    if (findSubdomain.owner != req.user.username) {
        res.redirect("/dash")
    } else {
        await Subdomain.deleteOne({subdomain: subdomain})
        res.redirect("/dash")
    }
})

router3.get("/", checkAuth, async function (req, res) {
    const subdomain = req.query.subdomain
    const findSubdomain = await Subdomain.findOne({subdomain: subdomain})
    if (findSubdomain.owner != req.user.username) {
        res.redirect("/dash")
    } else {
        res.render(__dirname + "/../views/editsubdomain.ejs", {message: req.flash("editerror"), subdomain: subdomain})
    }
})

router3.post("/", checkAuth, async function (req, res) {
    const subdomain = req.body.subdomain
    const findSubdomain = await Subdomain.findOne({subdomain: subdomain})
    if (findSubdomain.owner != req.user.username) {
        res.redirect("/dash")
    } else {
            await Subdomain.findOneAndUpdate({subdomain: subdomain}, {pointedTo: req.body.pointedto, recordType: req.body.recordType})
            res.redirect("/dash")
    }
})

module.exports.add = router
module.exports.delete = router2
module.exports.edit = router3