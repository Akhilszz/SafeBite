const mongoose = require('mongoose');

const OfficerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    district: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String },
    inspectionDetails: [{
        hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
        inspection: { type: String },
        date: { type: Date, default: Date.now }
    }],
    notification: [{
        title: { type: String },
        message: { type: String },
        date: { type: Date, default: Date.now() }

    }],
    permission: [{
        title: { type: String },
        details: { type: String },
        date: { type: Date, default: Date.now() },
        status: { type: String }

    }],

    document: { type: String },
    status: { type: String }
});

module.exports = mongoose.model('Officer', OfficerSchema);
