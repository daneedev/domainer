const mongoose = require("mongoose")

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    maxSubdomains: {
        type: Number,
        required: true
    },
    default: {
        type: Boolean,
        required: true
    }
})

const model = mongoose.model("roles", roleSchema)

module.exports = model