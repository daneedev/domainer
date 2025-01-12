require("dotenv").config({path: __dirname + "/data/.env"})
const express = require('express');
const app = express();
const passport = require('passport');
const path = require("path")
const flash = require("connect-flash")
const session = require("express-session")
const initializePassport = require("./handlers/passport")
const RateLimit = require("express-rate-limit")
const updateStats = require("./handlers/updateStats")
const nunjucks = require("nunjucks")

nunjucks.configure("views", {
  autoescape: true,
  express: app,
  watch: true
})


app.set("view-engine", "nunjucks")

app.use(express.static(path.join(__dirname, "public")))


const limiter = RateLimit({
  windowMs: 15*60*1000,
  max: 100
});
app.use(limiter);

// SYNC DB
const sequelize = require('./database');

sequelize.sync().then(() => console.log("Database is ready!"))

if (process.env.SETUPED == "yes") {
let https;
if (process.env.HTTPS == "yes") https = true
else https = false
initializePassport(passport)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: https,
      httpOnly: true,
      maxAge: 86400000,
    },
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  updateStats()

async function checkDefaultRole() {
const Role = require("./models/Role")
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

const cf = require("cloudflare")({
    token: process.env.CLOUDFLARE_API_TOKEN
})

module.exports.cf = cf

app.use("/setup", require("./routes/home").setup)

app.use("/setup", require("./routes/home").setup)
app.use("/setup2", require("./routes/home").setup2)
app.use("/", require("./routes/home").home)
app.use("/dash", require("./routes/home").dash)

app.use("/login", require("./routes/auth").login)
app.use("/register", require("./routes/auth").register)
app.use("/logout", require("./routes/auth").logout)

app.use("/add", require("./routes/subdomains").add)
app.use("/delete", require("./routes/subdomains").delete)
app.use("/edit", require("./routes/subdomains").edit)

app.use("/admin", require("./routes/admin").admin)
app.use("/approve", require("./routes/admin").approve)
app.use("/decline", require("./routes/admin").decline)
app.use("/toreview", require("./routes/admin").review)

app.use("/deleteuser", require("./routes/usersRoles").deleteUser)
app.use("/changerole", require("./routes/usersRoles").changeRole)
app.use("/deleterole", require("./routes/usersRoles").deleteRole)
app.use("/editrole", require("./routes/usersRoles").editRole)
app.use("/addrole", require("./routes/usersRoles").addRole)

app.use("/manage", require("./routes/usersRoles").manage)

app.listen(3000, () => console.log('Server running on port 3000'));