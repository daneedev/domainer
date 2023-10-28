require("dotenv").config()
const express = require('express');
const app = express();
const passport = require('passport');
const path = require("path")
const mongoose = require("mongoose")
const flash = require("connect-flash")
const session = require("cookie-session")
const initializePassport = require("./handlers/passport")
const RateLimit = require("express-rate-limit")
const updateStats = require("./handlers/updateStats")

app.set("view-engine", "ejs")

app.use(express.static(path.join(__dirname, "public")))

initializePassport(passport)

const limiter = RateLimit({
  windowMs: 15*60*1000,
  max: 100
});
app.use(limiter);

app.use(session({
    name: "logincookie",
    keys: [process.env.SESSION_SECRET],
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      domain: process.env.DOMAIN,
      maxAge: 86400000
    }
  }))

app.use(express.urlencoded({ extended: false }))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

mongoose.connect(process.env.MONGO_SRV, {}).then(() => {
    console.log("Connected to the database!")
}).catch((err) => {
    console.log("Failed connect to the database!")
})

const cf = require("cloudflare")({
    token: process.env.CLOUDFLARE_API_TOKEN
})

module.exports.cf = cf

updateStats()

async function checkDefaultRole() {
const Role = require("./models/Role")
const findDefaultRole = await Role.findOne({name: "default"})
if (!findDefaultRole) {
const DefaultRole = new Role({
  name: "default",
  maxSubdomains: 5,
  default: true
})
DefaultRole.save()
}
}
checkDefaultRole()

app.use("/setup", require("./routes/home").setup)
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

app.listen(3000, () => console.log('Server running on port 3000'));