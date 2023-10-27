const mongoose = require("mongoose")

const statsSchema = new mongoose.Schema({
    allSubdomains: {
        type: Number,
        required: true
    },
    approvedSubdomains: {
        type: Number,
        required: true
    },
    declinedSubdomains: {
        type: Number,
        required: true
    },
    pendingReviewSubdomains: {
        type: Number,
        required: true
    },
    totalUsers: {
        type: Number,
        required: true
    }
})

const model = mongoose.model("stats", statsSchema)

module.exports = model