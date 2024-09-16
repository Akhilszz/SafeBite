const mongoose = require('mongoose')

const Notification = new mongoose.Schema({
    title: { type: String },
    details: { type: String },
    date: { type: Date, default: Date.now },
    hotelName: { type: String }
})

const model = mongoose.model('Notification', Notification)

module.exports = model