const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    image: { type: String },
});

const Admin = mongoose.model('Admin', AdminSchema);


module.exports = Admin;
