async function updateStats() {
    const Stats = require("../models/Stats")
    const Subdomain = require("../models/Subdomain")
    const User = require("../models/User")
    const Role = require("../models/Role")
    const findStats = await Stats.findOne()
    const allsubdomains = await Subdomain.countDocuments()
    const approvedsubdomains = await Subdomain.countDocuments({status: 2})
    const declinedsubdomains = await Subdomain.countDocuments({status: 0})
    const pendingreviewsubdomains = await Subdomain.countDocuments({status: 1})
    const totalusers = await User.countDocuments()
    const totalroles = await Role.countDocuments()
    if (findStats) {
      await Stats.updateOne({}, {allSubdomains: allsubdomains, approvedSubdomains: approvedsubdomains, declinedSubdomains: declinedsubdomains, pendingReviewSubdomains: pendingreviewsubdomains, totalUsers: totalusers, totalRoles: totalroles})
    } else {
      const stats = new Stats({
        allSubdomains: allsubdomains,
        approvedSubdomains: approvedsubdomains,
        declinedSubdomains: declinedsubdomains,
        pendingReviewSubdomains: pendingreviewsubdomains,
        totalUsers: totalusers,
        totalRoles: totalroles
      })
      stats.save()
    }
  }

module.exports = updateStats;