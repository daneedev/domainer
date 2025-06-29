import express from 'express';
import { checkAdmin, checkAuth, checkSetup } from '../handlers/checkAuth';
import Subdomain from "../models/Subdomain";
import { cf } from "../server";
import axios from "axios";
import Stats from "../models/Stats";
import updateStats from "../handlers/updateStats";
import User from "../models/User";
import Role from "../models/Role";
import fs from "fs";

const router = express.Router();
const router2 = express.Router();
const router3 = express.Router();
const router4 = express.Router();

router.get("/", checkSetup, checkAuth, checkAdmin, async function (req, res) {
    const subdomains = await Subdomain.findAll()
    const latestversion = await axios.get("https://version.danee.dev/domainer/version.txt").then((res) => {return res.data})
    const stats = await Stats.findOne()
    const packageJsonContent = JSON.parse(fs.readFileSync(__dirname + "/../package.json", "utf8"));
    const currentversion = packageJsonContent.version;
    const users = await User.findAll()
    const roles = await Role.findAll()
    updateStats()
    res.render("admin.html", {subdomains: subdomains, message: req.flash("adminerror"), stats: stats, latestversion: latestversion, currentversion: currentversion, users: users, roles: roles})
})

router2.post("/", checkSetup, checkAuth, checkAdmin, async function (req, res) {
    const findSubdomain = await Subdomain.findOne({ where: {subdomain: req.body.subdomain}})
    if (findSubdomain) {
        if (findSubdomain.status == 2) {
            req.flash("adminerror", "That subdomain is already approved!")
            res.redirect("/admin")
        } else {
            const subdomain = await Subdomain.findOne({where: {subdomain: req.body.subdomain}})
            if (!subdomain) {
                req.flash("adminerror", "That subdomain doesn't exist!")
                res.redirect("/admin")
                return;
            }
            subdomain.status = 2
            subdomain.save()
            await cf.dns.records.create({
                zone_id: process.env.CLOUDFLARE_ZONE_ID || "",
                type: findSubdomain.recordType,
                name: findSubdomain.subdomain,
                content: findSubdomain.pointedTo,
                ttl: 1,
                proxied: false
            })
            res.redirect("/admin")
        }
    } else {
        req.flash("adminerror", "That subdomain doesn't exist!")
        res.redirect("/admin")
    }
})

router3.post("/", checkSetup, checkAuth, checkAdmin, async function (req, res) {
    const findSubdomain = await Subdomain.findOne({where: {subdomain: req.body.subdomain}})
    if (findSubdomain) {
        if (findSubdomain.status == 0) {
            req.flash("adminerror", "That subdomain is already declined!")
            res.redirect("/admin")
        } else {
            findSubdomain.status = 0
            findSubdomain.save()
            if (findSubdomain.status == 2) {
            cf.dns.records.list({zone_id: process.env.CLOUDFLARE_ZONE_ID || ""}).then((data) => {
                const record = data.result.find(record => record.name == findSubdomain.subdomain)
                if (!record) {
                    req.flash("adminerror", "That subdomain doesn't exist in Cloudflare!")
                    res.redirect("/admin")
                    return;
                }
                cf.dns.records.delete(record.id, {zone_id: process.env.CLOUDFLARE_ZONE_ID || ""})
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
    const findSubdomain = await Subdomain.findOne({ where: {subdomain: req.body.subdomain}})
    if (findSubdomain) {
        if (findSubdomain.status == 1) {
            req.flash("adminerror", "That subdomain is already in review!")
            res.redirect("/admin")
        } else {
            findSubdomain.status = 1
            findSubdomain.save()
            if (findSubdomain.status == 2) {
                cf.dns.records.list({zone_id: process.env.CLOUDFLARE_ZONE_ID || ""}).then((data) => {
                    const record = data.result.find(record => record.name == findSubdomain.subdomain)
                    if (!record) {
                        req.flash("adminerror", "That subdomain doesn't exist in Cloudflare!")
                        res.redirect("/admin")
                        return;
                    }
                    cf.dns.records.delete(record.id, {zone_id: process.env.CLOUDFLARE_ZONE_ID || ""})
                })
                }
            res.redirect("/admin")
        }
    } else {
        req.flash("adminerror", "That subdomain doesn't exist!")
        res.redirect("/admin")
    }
})

export const admin = router;
export const approve = router2;
export const decline = router3;
export const review = router4;