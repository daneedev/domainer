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

router.get("/", checkSetup, checkAuth, checkAdmin, async function (req, res) {
    const subdomains = (await Subdomain.findAll()).sort((a, b) => {
        if (a.status === b.status) {
            return a.subdomain.localeCompare(b.subdomain);
        }
        return a.status - b.status;
    })
    const latestversion = await axios.get("https://version.danee.dev/domainer/version.txt").then((res) => {return res.data})
    const stats = await Stats.findOne()
    const packageJsonContent = JSON.parse(fs.readFileSync("package.json", "utf8"));
    const currentversion = packageJsonContent.version;
    const users = await User.findAll()
    const roles = await Role.findAll()
    const user = req.user as User;
    const userDb = await User.findOne({ where: { username: user.username } });
    updateStats()
    res.render("admin/admin.html", {domain: process.env.DOMAIN, user: userDb, subdomains: subdomains, error: req.flash("error"), stats: stats, latestversion: latestversion, currentversion: currentversion, users: users, roles: roles, success: req.flash("success")})
})

router.post("/approve/:id", checkSetup, checkAuth, checkAdmin, async function (req, res) {
    const findSubdomain = await Subdomain.findOne({ where: { id: req.params.id } })
    if (findSubdomain) {
        if (findSubdomain.status == 1) {
            req.flash("error", "That subdomain is already approved!")
            res.redirect("/admin")
        } else {
            const subdomain = await Subdomain.findOne({where: {id: req.params.id}})
            if (!subdomain) {
                req.flash("error", "That subdomain doesn't exist!")
                res.redirect("/admin")
                return;
            }
            subdomain.status = 1
            subdomain.save()
            await cf.dns.records.create({
                zone_id: process.env.CLOUDFLARE_ZONE_ID || "",
                type: findSubdomain.recordType,
                name: findSubdomain.subdomain,
                content: findSubdomain.pointedTo,
                ttl: 1,
                proxied: false
            })
            req.flash("success", "Subdomain approved successfully! DNS record created in Cloudflare.")
            res.redirect("/admin")
        }
    } else {
        req.flash("error", "That subdomain doesn't exist!")
        res.redirect("/admin")
    }
})

router.post("/decline/:id", checkSetup, checkAuth, checkAdmin, async function (req, res) {
    const findSubdomain = await Subdomain.findOne({where: {id: req.params.id}})
    if (findSubdomain) {
        if (findSubdomain.status == 2) {
            req.flash("error", "That subdomain is already declined!")
            res.redirect("/admin")
        } else {
            if (findSubdomain.status == 1) {
            cf.dns.records.list({zone_id: process.env.CLOUDFLARE_ZONE_ID || ""}).then((data) => {
                const record = data.result.find(record => record.name == findSubdomain.subdomain)
                if (!record) {
                    req.flash("error", "That subdomain doesn't exist in Cloudflare!")
                    res.redirect("/admin")
                    return;
                }
                cf.dns.records.delete(record.id, {zone_id: process.env.CLOUDFLARE_ZONE_ID || ""})
            })
            }
            findSubdomain.status = 2
            findSubdomain.save()
            req.flash("success", "Subdomain declined successfully! DNS record removed from Cloudflare.")
            res.redirect("/admin")
        }
    } else {
        req.flash("error", "That subdomain doesn't exist!")
        res.redirect("/admin")
    }
})

router.post("/review/:id", checkSetup, checkAuth, checkAdmin, async function (req, res) {
    const findSubdomain = await Subdomain.findOne({ where: { id: req.params.id } })
    if (findSubdomain) {
        if (findSubdomain.status == 0) {
            req.flash("error", "That subdomain is already in review!")
            res.redirect("/admin")
        } else {
            if (findSubdomain.status == 1) {
                cf.dns.records.list({zone_id: process.env.CLOUDFLARE_ZONE_ID || ""}).then((data) => {
                    const record = data.result.find(record => record.name == findSubdomain.subdomain)
                    if (!record) {
                        req.flash("error", "That subdomain doesn't exist in Cloudflare!")
                        res.redirect("/admin")
                        return;
                    }
                    cf.dns.records.delete(record.id, {zone_id: process.env.CLOUDFLARE_ZONE_ID || ""})
                })
                }
            findSubdomain.status = 0
            findSubdomain.save()
            req.flash("success", "Subdomain is now in review! DNS record removed from Cloudflare.")
            res.redirect("/admin")
        }
    } else {
        req.flash("error", "That subdomain doesn't exist!")
        res.redirect("/admin")
    }
})

export default router;