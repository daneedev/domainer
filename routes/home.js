const express = require('express');
const { checkAuth, checkNotAuth, checkSetup, checkNotSetup } = require('../handlers/checkAuth');
const router = express.Router();
const router2 = express.Router()
const router3 = express.Router()
const router4 = express.Router()
const Subdomain = require("../models/Subdomain")
const fs = require('fs');
const User = require("../models/User")
const Role = require("../models/Role")
const bcrypt = require("bcrypt")

router.get("/", checkSetup, checkNotAuth, function (req, res) {

    res.render("index.html", {domain: process.env.DOMAIN})
})

router2.get("/", checkSetup, checkAuth, async function (req, res) {
    const subdomains = await Subdomain.findAll({where:{owner: req.user.username}})
    const user = await User.findOne({where:{username: req.user.username}})
    const role = await Role.findOne({where: { name: user.role}})
    res.render("dash.html", {domain: process.env.DOMAIN, subdomains: subdomains, user: req.user, subdomainsLimit: role.maxSubdomains, subdomainsCount: user.subdomainsCount})
})

router3.get("/", checkNotSetup, async function (req, res) {
    res.render("setup/setup.html", {})
})

router3.post("/", checkNotSetup, async function (req, res) {
    const domain = req.body.domain
    const mongosrv = req.body.mongodb
    const sessionsecret = req.body.sessionsecret
    const cftoken = req.body.cftoken
    const cfzone = req.body.cfzone
    let https;
    if (req.body.https == true) https = "yes"
    else https = "no"
    fs.writeFileSync(__dirname + '/../data/.env', `\nMONGO_SRV=${mongosrv}\n`, { flag: 'a' });
    fs.writeFileSync(__dirname + '/../data/.env', `DOMAIN=${domain}\n`, { flag: 'a' });
    fs.writeFileSync(__dirname + '/../data/.env', `SESSION_SECRET=${sessionsecret}\n`, { flag: 'a' });
    fs.writeFileSync(__dirname + '/../data/.env', `CLOUDFLARE_API_TOKEN=${cftoken}\n`, { flag: 'a' });
    fs.writeFileSync(__dirname + '/../data/.env', `CLOUDFLARE_ZONE_ID=${cfzone}\n`, { flag: 'a' });
    fs.writeFileSync(__dirname + '/../data/.env', `HTTPS=${https}\n`, { flag: 'a' });
    require("dotenv").config({path: __dirname + "/../data/.env"})
    res.redirect("/setup2")
    process.exit()
})

router4.get("/", checkNotSetup, async function (req, res) {
    res.render("setup/setup2.html", {})
})

router4.post("/", checkNotSetup, async function (req, res) {
    const username = req.body.username
    const password = req.body.password
    const email = req.body.email
    const hashedPassword = await bcrypt.hash(password, 10)
    User.create({
        username: username,
        email: email,
        password: hashedPassword,
        role: 'default',
        subdomainsCount: 0,
        isAdmin: true
    })
    fs.writeFileSync(__dirname + '/../data/.env', `SETUPED=yes\n`, { flag: 'a' })
    require("dotenv").config({path: __dirname + "/../data/.env"})
    res.redirect("/")
    process.exit()
})

module.exports.home = router;
module.exports.dash = router2;
module.exports.setup = router3
module.exports.setup2 = router4