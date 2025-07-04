import dotenv from "dotenv";
dotenv.config({path: __dirname + "/data/.env"});
import express from 'express';
const app = express();
import passport from 'passport';
import path from "path";
import flash from "connect-flash";
import session from "express-session";
import initializePassport from "./handlers/passport";
import RateLimit from "express-rate-limit";
import updateStats from "./handlers/updateStats";
import nunjucks from "nunjucks";
import Role from "./models/Role";

nunjucks.configure("src/views", {
  autoescape: true,
  express: app,
  watch: true,
})


app.set("view engine", "nunjucks")

app.use(express.static(path.join(__dirname, "public")));


const limiter = RateLimit({
  windowMs: 15*60*1000,
  max: 100
});
app.use(limiter);

// SYNC DB
import sequelize from './database';

sequelize.sync().then(() => console.log("Database is ready!"))

if (process.env.SETUPED == "yes") {
let https;
if (process.env.HTTPS == "yes") https = true
else https = false
initializePassport()
app.use(session({
    secret: process.env.SESSION_SECRET || Math.random().toString(36).substring(2, 15),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production" ? true : https,
      httpOnly: true,
      maxAge: 86400000,
    },
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  updateStats()

async function checkDefaultRole() {
const findDefaultRole = await Role.findOne({where:{name: "default"}})
if (!findDefaultRole) {
Role.create({
  name: "default",
  maxSubdomains: 5,
  default: true
})
}
}
checkDefaultRole()
}
app.use(express.urlencoded({ extended: false }))
app.use(flash())

import { Cloudflare } from "cloudflare";
const cf = new Cloudflare({
    apiToken: process.env.CLOUDFLARE_API_TOKEN
})

export { cf };

import { setup, home, dash } from "./routes/home";
import subdomainRoutes from "./routes/subdomains";
import adminRoutes from "./routes/admin";
import usersRoutes from "./routes/users";
import rolesRoutes from "./routes/roles";
import authRoutes from "./routes/auth";

app.use("/setup", setup)

app.use("/setup", setup)
app.use("/", home)
app.use("/dash", dash)
app.use("/auth", authRoutes)
app.use("/subdomains", subdomainRoutes)
app.use("/admin", adminRoutes)
app.use("/users", usersRoutes)
app.use("/roles", rolesRoutes)

app.listen(3000, () => console.log('Server running on port 3000'));