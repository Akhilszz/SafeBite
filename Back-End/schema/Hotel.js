const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    liceno: { type: String },
    address: [{
        state: String,
        city: String,
        pincode: String,
        district: String,
        phone: String
    }],
    image: { type: String },
    password: { type: String, required: true },
    request: { type: String, default: 'none' },
    rating: { type: String },
    complaints: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        complaint: { type: String },
        proof: { type: String },
        reply: { type: String },
        date: { type: Date, default: Date.now }
    }],
    suggestions: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        suggestion: { type: String },
        reply: { type: String },
        date: { type: Date, default: Date.now }
    }],

    blacklist: { type: Boolean, default: false },
    penalty: { type: Number },


    notification: [{
        title: String,
        message: String,
        date: Date,

    }],

    inspectionDetails: [{
        officerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Officer' },
        inspection: { type: String },
        date: { type: Date, default: Date.now }
    }],

    document: { type: String },
    status: { type: String }
});

module.exports = mongoose.model('Hotel', HotelSchema);
