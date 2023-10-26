require("dotenv").config()
const express = require('express');
const app = express();
const passport = require('passport');
const path = require("path")
const mongoose = require("mongoose")

app.set("view-engine", "ejs")

app.use(express.static(path.join(__dirname, "public")))

mongoose.connect(process.env.MONGO_SRV, {}).then(() => {
    console.log("Connected to the database!")
}).catch((err) => {
    console.log("Failed connect to the database!")
})

app.use("/", require("./routes/home"))

app.use("/login", require("./routes/auth").login)
app.use("/register", require("./routes/auth").register)

app.listen(3000, () => console.log('Server running on port 3000'));