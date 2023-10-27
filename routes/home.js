const express = require('express');
const { checkAuth, checkNotAuth, checkSetup, checkNotSetup } = require('../handlers/checkAuth');
const router = express.Router();
const router2 = express.Router()
const router3 = express.Router()
const Subdomain = require("../models/Subdomain")
const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require("mongoose")

router.get("/", checkSetup, checkNotAuth, function (req, res) {

    res.render(__dirname + "/../views/index.ejs", {domain: process.env.DOMAIN})
})

router2.get("/", checkSetup, checkAuth, async function (req, res) {
    const subdomains = await Subdomain.find({owner: req.user.username}).sort({status: 1})
    res.render(__dirname + "/../views/dash.ejs", {domain: process.env.DOMAIN, subdomains: subdomains, user: req.user})
})

router3.get("/", checkNotSetup, async function (req, res) {
    res.render(__dirname + "/../views/setup.ejs", {})
})

router3.post("/", checkNotSetup, async function (req, res) {
    const domain = req.body.domain
    const mongosrv = req.body.mongodb
    const sessionsecret = req.body.sessionsecret
    const cftoken = req.body.cftoken
    const cfzone = req.body.cfzone
    fs.writeFileSync(__dirname + '/../.env', `\nMONGO_SRV=${mongosrv}\n`, { flag: 'a' });
    fs.writeFileSync(__dirname + '/../.env', `DOMAIN=${domain}\n`, { flag: 'a' });
    fs.writeFileSync(__dirname + '/../.env', `SESSION_SECRET=${sessionsecret}\n`, { flag: 'a' });
    fs.writeFileSync(__dirname + '/../.env', `CLOUDFLARE_API_TOKEN=${cftoken}\n`, { flag: 'a' });
    fs.writeFileSync(__dirname + '/../.env', `CLOUDFLARE_ZONE_ID=${cfzone}\n`, { flag: 'a' });
    fs.writeFileSync(__dirname + '/../.env', `SETUPED=yes\n`, { flag: 'a' });
    dotenv.config()
    mongoose.connect(process.env.MONGO_SRV, {}).then(() => {
        console.log("Connected to the database!")
    }).catch((err) => {
        console.log("Failed connect to the database!")
    })
    res.redirect("/")
})

module.exports.home = router;
module.exports.dash = router2;
module.exports.setup = router3