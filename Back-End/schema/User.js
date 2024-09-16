const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    password: { type: String, required: true },
    status: { type: String },
    suggestions: [{
        hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
        suggestion: { type: String },
        date: { type: Date, default: Date.now }
    }],
    complaints: [{
        hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
        complaint: { type: String },
        proof: { type: String },
        date: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('User', UserSchema);
