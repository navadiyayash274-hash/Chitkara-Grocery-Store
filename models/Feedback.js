const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    name:         { type: String, required: true },
    email:        { type: String, required: true },
    userContact:  { type: String, default: '' },   // cgs_user_contact from localStorage
    rating:       { type: Number, min: 1, max: 5 },
    message:      { type: String, required: true },
    category:     { type: String, default: '' },

    // Admin reply
    adminReply:   { type: String, default: null },
    repliedAt:    { type: Date,   default: null },
    autoReplied:  { type: Boolean, default: false }, // true when auto-sent for ≤2 stars

    createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
