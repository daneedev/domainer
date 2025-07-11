import express from "express";
import { checkAuth, checkAdmin } from "../handlers/checkAuth";
import User from "../models/User";
import bcrypt from "bcrypt";
import Subdomain from "../models/Subdomain";

const router = express.Router();

router.post("/delete", checkAuth, checkAdmin, async function (req, res) {
    const findUser = await User.findOne({where:{username: req.body.username}})
    if (!findUser) {
        req.flash("adminerror", "That user doesn't exist!")
        res.redirect("/admin")
    } else {
        await User.destroy({where:{username: req.body.username}})
        res.redirect("/admin")
    }
})

router.get("/edit", checkAuth, async function (req, res) {
    const user = await User.findOne({where:{username: (req.user as User).username}})
    res.render("edit/edituser.html", {user: user, message: req.flash("editerror")})
})

router.post("/edit", checkAuth, async function (req, res) {
    const findUser = await User.findOne({where:{username: req.body.username}})
    if (!findUser) {
        req.flash("editerror", "That user doesn't exist!")
        res.redirect("/manage/edit")
    } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        findUser.username = req.body.username
        findUser.email = req.body.email
        findUser.password = hashedPassword
        findUser.save()
        await (await Subdomain.findAll({where:{owner: (req.user as User).username}})).forEach((subdomain) => {
            subdomain.owner = req.body.username
            subdomain.save()
        })
        req.logOut(function(err) {
            if (err) {
                console.error("Logout error:", err);
                req.flash("error", "An error occurred while logging out. Please try again.");
                return res.redirect("/dash");
            }
        });
        res.redirect("/login")
    }
})

export default router;