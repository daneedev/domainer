import express from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import passport from "passport";
import { checkNotAuth, checkSetup, checkAuth } from "../handlers/checkAuth";
import Role from "../models/Role";

const router = express.Router();

router.get("/login", checkSetup, checkNotAuth, function (req, res) {
    res.render("auth/login.html", {domain: process.env.DOMAIN, message: req.flash('error') })
})

router.post("/login", checkSetup, checkNotAuth, passport.authenticate("local", {
    successRedirect: "/dash",
    failureRedirect: '/login',
    failureFlash: true
}))

router.get("/register", checkSetup, checkNotAuth, function (req, res) {
    res.render("auth/register.html", {domain: process.env.DOMAIN, message: req.flash('error')})
})

router.post("/register", checkSetup, checkNotAuth, async function (req, res) {
    const findUser = await User.findOne({where: {username: req.body.username}})
    if (findUser) {
        req.flash("error", "That username is already taken!")
        res.redirect("/register")
    } else if (req.body.password.length < 8) { 
        req.flash("error", "Password must be at least 8 characters!")
        res.redirect("/register")
    } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const role = await Role.findOne({where: {default: true}})
        if (!role) {
            req.flash("error", "No default role found! Please contact the administrator.")
            res.redirect("/register")
            return;
        }
        User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            isAdmin: false,
            role: role.name,
            subdomainsCount: 0
        })
            res.redirect("/login")
    }
})

router.post("/logout", checkSetup, checkAuth, function (req, res) {
    req.logOut(function(err) {
        if (err) {
            console.error("Logout error:", err);
            req.flash("error", "An error occurred while logging out. Please try again.");
            return res.redirect("/dash");
        }
    })
    res.redirect("/")
})

export default router;