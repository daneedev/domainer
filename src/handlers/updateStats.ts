import Stats from "../models/Stats";
import Subdomain from "../models/Subdomain";
import User from "../models/User";
import Role from "../models/Role";

async function updateStats() {
    const findStats = await Stats.findOne()
    const allsubdomains = (await Subdomain.findAndCountAll()).count
    const approvedsubdomains = (await Subdomain.findAndCountAll({where: {status: 2}})).count
    const declinedsubdomains = (await Subdomain.findAndCountAll({where: {status: 0}})).count
    const pendingreviewsubdomains = (await Subdomain.findAndCountAll({where: {status: 1}})).count
    const totalusers = (await User.findAndCountAll()).count
    const totalroles = await (await Role.findAndCountAll()).count
    if (findStats) {
      findStats.allSubdomains = allsubdomains
      findStats.approvedSubdomains = approvedsubdomains
      findStats.declinedSubdomains = declinedsubdomains
      findStats.pendingReviewSubdomains = pendingreviewsubdomains
      findStats.totalUsers = totalusers
      findStats.totalRoles = totalroles
      findStats.save()
    } else {
      Stats.create({
        allSubdomains: allsubdomains,
        approvedSubdomains: approvedsubdomains,
        declinedSubdomains: declinedsubdomains,
        pendingReviewSubdomains: pendingreviewsubdomains,
        totalUsers: totalusers,
        totalRoles: totalroles
      })
    }
  }

export default updateStats;