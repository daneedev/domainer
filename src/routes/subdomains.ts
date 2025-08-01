import express from "express";
import Subdomain from "../models/Subdomain";
import { checkAuth, checkSetup } from "../handlers/checkAuth";
import RateLimit from "express-rate-limit";
import sanitize from "sanitize-filename";
import { cf } from "../server";
import User from "../models/User";
import Role from "../models/Role";

const router = express.Router();


router.post("/add", checkSetup, checkAuth, async function (req, res) {
    const findSubdomain = await Subdomain.findOne({where:{subdomain: req.body.subdomain}})
    if (findSubdomain) {
        req.flash("error", "That subdomain already exists!")
        res.redirect("/dash")
    } else {
        const user = await User.findOne({where:{username: (req.user as User).username}})
        if (!user) {
            req.flash("error", "User not found!")
            res.redirect("/dash")
            return;
        }
        const role = await Role.findOne({where:{name: user.role}})
        if (!role) {
            req.flash("error", "No role found! Please contact the administrator.")
            res.redirect("/dash")
            return;
        }
        if (user.subdomainsCount >= role.maxSubdomains) {
            req.flash("error", `You can't have more than ${role.maxSubdomains} subdomains!`)
            res.redirect("/dash")
        } else {
        Subdomain.create({
            subdomain: `${req.body.subdomain}.${process.env.DOMAIN}`,
            owner: (req.user as User).username,
            pointedTo: req.body.pointedto,
            recordType: req.body.recordType,
            status: 0
        })
        user.subdomainsCount++
        user.save()
        res.redirect("/dash")
    }
    }
})

router.post("/delete", checkSetup, checkAuth, async function (req, res) {
    const subdomain = req.body.subdomain
    const findSubdomain = await Subdomain.findOne({where:{subdomain: subdomain}})
    if (!findSubdomain) {
        req.flash("editerror", "That subdomain doesn't exist!")
        res.redirect("/dash")
        return;
    }
    if (findSubdomain.owner != (req.user as User).username) {
        res.redirect("/dash")
    } else {
        await Subdomain.destroy({where:{subdomain: subdomain}})
        const user = await User.findOne({where:{username: (req.user as User).username}})
        if (!user) {
            req.flash("editerror", "User not found!")
            res.redirect("/dash")
            return;
        }
        user.subdomainsCount--
        user.save()
        if (findSubdomain.status == 1) {
            cf.dns.records.list({zone_id: process.env.CLOUDFLARE_ZONE_ID || ""}).then((data) => {
                const record = data.result.find(record => record.name == findSubdomain.subdomain)
                if (!record) {
                    req.flash("editerror", "That subdomain doesn't exist in Cloudflare!")
                    res.redirect("/dash")
                    return;
                }
                cf.dns.records.delete(record.id, {
                    zone_id: process.env.CLOUDFLARE_ZONE_ID || ""
                })
            })
        }
        res.redirect("/dash")
    }
})

router.get("/edit", checkSetup, checkAuth, async function (req, res) {
    if (!req.query.subdomain) {
        req.flash("editerror", "No subdomain specified!")
        res.redirect("/dash")
        return;
    }
    const findSubdomain = await Subdomain.findOne({where:{subdomain: req.query.subdomain}})
    if (!findSubdomain) {
        req.flash("editerror", "That subdomain doesn't exist!")
        res.redirect("/dash")
        return;
    }
    if (findSubdomain.owner != (req.user as User).username) {
        res.redirect("/dash")
    } else {
        res.render("edit/editsubdomain.html", {message: req.flash("editerror"), subdomain: findSubdomain})
    }
})

const editLimiter = RateLimit({
    windowMs: 5 * 60 * 1000,
    max: 500
})

router.post("/edit", checkSetup, checkAuth, editLimiter, async function (req, res) {
    const subdomain = req.body.subdomain
    const findSubdomain = await Subdomain.findOne({where:{subdomain: subdomain}})
    if (!findSubdomain) {
        req.flash("editerror", "That subdomain doesn't exist!")
        res.redirect("/dash")
        return;
    }
    if (findSubdomain.owner != (req.user as User).username) {
        res.redirect("/dash")
    } else if (!req.body.subdomain.includes(process.env.DOMAIN)) {
        req.flash("editerror", `That subdomain doesn't contain ${process.env.DOMAIN}!`)
        res.redirect("/dash")
    } else {
        const updateSubdomain = await Subdomain.findOne({where:{subdomain: subdomain}})
        if (!updateSubdomain) {
            req.flash("editerror", "That subdomain doesn't exist!")
            res.redirect("/dash")
            return;
        }
        updateSubdomain.pointedTo = req.body.pointedto
        updateSubdomain.recordType = req.body.recordType
        updateSubdomain.save()
        cf.dns.records.list({zone_id: process.env.CLOUDFLARE_ZONE_ID || ""}).then((data) => {
            const record = data.result.find(record => record.name == findSubdomain.subdomain)
            if (!record) {
                req.flash("editerror", "That subdomain doesn't exist in Cloudflare!")
                res.redirect("/dash")
                return;
            }
            cf.dns.records.edit(record.id, {
                zone_id: process.env.CLOUDFLARE_ZONE_ID || "",
                type: req.body.recordType,
                name: findSubdomain.subdomain,
                content: req.body.pointedto,
                ttl: 1,
                proxied: false
            })
        })
        res.redirect("/dash")
    }
})

export default router;
