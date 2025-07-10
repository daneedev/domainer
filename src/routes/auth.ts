import express from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import passport from "passport";
import { checkNotAuth, checkSetup, checkAuth } from "../handlers/checkAuth";
import Role from "../models/Role";

const router = express.Router();

router.get("/login", checkSetup, checkNotAuth, function (req, res) {
    res.render("auth/login.html", {domain: process.env.DOMAIN, error: req.flash('error'), success: req.flash('success')})
})

router.post("/login", checkSetup, checkNotAuth, passport.authenticate("local", {
    successRedirect: "/dash",
    failureRedirect: '/auth/login',
    failureFlash: true
}))

router.get("/register", checkSetup, checkNotAuth, function (req, res) {
    res.render("auth/register.html", {domain: process.env.DOMAIN, error: req.flash('error')})
})

router.post("/register", checkSetup, checkNotAuth, async function (req, res) {
    const findUser = await User.findOne({where: {username: req.body.username}})
    if (findUser) {
        req.flash("error", "That username is already taken!")
        res.redirect("/auth/register")
    } else if (req.body.password.length < 8) { 
        req.flash("error", "Password must be at least 8 characters!")
        res.redirect("/auth/register")
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
        req.flash("success", "Registration successful! You can now log in.")
            res.redirect("/auth/login")
    }
})

router.get("/logout", checkSetup, checkAuth, function (req, res) {
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