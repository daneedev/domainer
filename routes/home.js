const express = require('express');
const { checkAuth, checkNotAuth } = require('../handlers/checkAuth');
const router = express.Router();
const router2 = express.Router()
const Subdomain = require("../models/Subdomain")

router.get("/", checkNotAuth, function (req, res) { 
    res.render(__dirname + "/../views/index.ejs", {domain: process.env.DOMAIN})
})

router2.get("/", checkAuth, async function (req, res) {
    const subdomains = await Subdomain.find({owner: req.user.username}).sort({status: 1})
    res.render(__dirname + "/../views/dash.ejs", {domain: process.env.DOMAIN, subdomains: subdomains, user: req.user})
})

module.exports.home = router;
module.exports.dash = router2;