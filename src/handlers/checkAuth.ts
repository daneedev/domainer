import { Request, Response, NextFunction } from "express";
import User from "../models/User";

function checkAuth(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/login")
}

function checkNotAuth(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        return res.redirect("/dash")
    }
    next()
}

function checkAdmin(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User;
    if (user.isAdmin) {
        return next()
    }
    res.redirect("/dash")
}

function checkSetup(req: Request, res: Response, next: NextFunction) {
    if (process.env.SETUPED == "yes") {
        next()
      } else {
        res.redirect("/setup")
      }
}

function checkNotSetup(req: Request, res: Response, next: NextFunction) {
    if (process.env.SETUPED == "yes") {
        res.redirect("/")
      } else {
        next()
      }

}

export { checkAuth, checkNotAuth, checkAdmin, checkSetup, checkNotSetup };