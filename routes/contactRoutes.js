const express = require('express');
const router  = express.Router();
const Contact = require('../models/Contact');
const { requireAdmin } = require('../middleware/adminAuth');

// POST /api/contact — save contact message
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        const contact = new Contact({ name, email, phone, message });
        await contact.save();
        res.status(201).json({ message: 'Message sent successfully', contact });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET /api/contact — get all messages
router.get('/', requireAdmin, async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
