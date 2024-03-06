const LocalStrategy = require("passport-local").Strategy
const User = require("../models/User")
const bcrypt = require("bcrypt")

function initialize(passport) {
    const authUser = async (username, password, done) => {
        const findUser = await User.findOne({where: {username: username}})
        if (!findUser) {
            return done(null, false, { message: "Username or password is incorrect"})
        } 
        try {
            if (await bcrypt.compare(password, findUser.password)) {
                return done(null, findUser)
            } else {
                return done (null, false, { message: "Username or password is incorrect"})
            }
        } catch (err) {
            return done(err)
        }
        return done(null, findUser)
    }
    passport.use(new LocalStrategy({}, authUser))
    passport.serializeUser(function(user, done) {
        done(null, user);
      });
      
      passport.deserializeUser(function(user, done) {
        done(null, user);
      });
}

module.exports = initialize