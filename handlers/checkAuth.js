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

module.exports.checkAuth = checkAuth
module.exports.checkNotAuth = checkNotAuth