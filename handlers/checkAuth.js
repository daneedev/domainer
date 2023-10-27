function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/login")
}

function checkNotAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/dash")
    }
    next()
}

function checkAdmin(req, res, next) {
    if (req.user.isAdmin) {
        return next()
    }
    res.redirect("/dash")
}

function checkSetup(req, res, next) {
    if (process.env.SETUPED == "yes") {
        next()
      } else {
        res.redirect("/setup")
      }
}

function checkNotSetup(req, res, next) {
    if (process.env.SETUPED == "yes") {
        res.redirect("/")
      } else {
        next()
      }

}

module.exports.checkAuth = checkAuth
module.exports.checkNotAuth = checkNotAuth
module.exports.checkAdmin = checkAdmin
module.exports.checkSetup = checkSetup
module.exports.checkNotSetup = checkNotSetup