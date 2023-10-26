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

module.exports.checkAuth = checkAuth
module.exports.checkNotAuth = checkNotAuth
module.exports.checkAdmin = checkAdmin