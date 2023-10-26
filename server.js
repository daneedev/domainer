require("dotenv").config()
const express = require('express');
const app = express();
const passport = require('passport');
const path = require("path")
const mongoose = require("mongoose")
const flash = require("connect-flash")
const session = require("cookie-session")
const initializePassport = require("./handlers/passport")
const { checkAuth, checkNotAuth } = require("./handlers/checkAuth")

app.set("view-engine", "ejs")

app.use(express.static(path.join(__dirname, "public")))

initializePassport(passport)

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

app.use("/", require("./routes/home"))

app.use("/login", require("./routes/auth").login)
app.use("/register", require("./routes/auth").register)


app.listen(3000, () => console.log('Server running on port 3000'));