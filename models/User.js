const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:      { type: String, required: true },
    email:     { type: String, default: '' },
    password:  { type: String, default: 'otp_verified' },
    phone:     { type: String, default: '' },
    gender:    { type: String, default: '' },
    dob:       { type: String, default: '' },
    address:   { type: String, default: '' },
    city:      { type: String, default: '' },
    pincode:   { type: String, default: '' },
    contact:   { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
