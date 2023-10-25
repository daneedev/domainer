require("dotenv").config()
const express = require('express');
const app = express();
const passport = require('passport');
const path = require("path")

app.set("view-engine", "ejs")

app.use(express.static(path.join(__dirname, "public")))

app.use("/", require("./routes/home"))

app.use("/login", require("./routes/auth").login)
app.use("/register", require("./routes/auth").register)

app.listen(3000, () => console.log('Server running on port 3000'));