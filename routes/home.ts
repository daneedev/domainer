import express from 'express';
import { checkAuth, checkNotAuth, checkSetup, checkNotSetup } from '../handlers/checkAuth';
import Subdomain from "../models/Subdomain";
import fs from 'fs';
import User from "../models/User";
import Role from "../models/Role";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

const router = express.Router();
const router2 = express.Router();
const router3 = express.Router();
const router4 = express.Router();

router.get("/", checkSetup, checkNotAuth, function (req, res) {

    res.render("index.html", {domain: process.env.DOMAIN})
})

router2.get("/", checkSetup, checkAuth, async function (req, res) {
    const user = req.user as User;
    const subdomains = await Subdomain.findAll({where:{owner: user.username}})
    const userDb = await User.findOne({where:{username: user.username}})
    const role = await Role.findOne({where: { name: user.role}})
    if (!role) {
        req.flash("error", "No role found! Please contact the administrator.")
        res.redirect("/login")
        return;
    }
    res.render("dash.html", {domain: process.env.DOMAIN, subdomains: subdomains, user: userDb, subdomainsLimit: role.maxSubdomains, subdomainsCount: user.subdomainsCount})
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
    dotenv.config({path: __dirname + "/../data/.env"})
    res.redirect("/")
    process.exit()
})

export const home = router;
export const dash = router2;
export const setup = router3;
export const setup2 = router4;