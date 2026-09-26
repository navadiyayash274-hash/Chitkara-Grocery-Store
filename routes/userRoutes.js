const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const otpStore = new Map();

// Generate and verify demo OTPs used by the login and signup pages.
router.post('/send-otp', (req, res) => {
    const contact = String(req.body.contact || '').trim();
    if (!contact) {
        return res.status(400).json({ message: 'Email or phone number is required' });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    otpStore.set(contact, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });
    res.json({ message: 'OTP generated successfully', otp });
});

router.post('/verify-otp', (req, res) => {
    const contact = String(req.body.contact || '').trim();
    const otp = String(req.body.otp || '').trim();
    const savedOtp = otpStore.get(contact);

    if (!savedOtp || savedOtp.expiresAt < Date.now() || savedOtp.otp !== otp) {
        return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    otpStore.delete(contact);
    res.json({ message: 'OTP verified successfully' });
});

// POST /api/users/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, password, gender, dob, address, city, pincode, contact } = req.body;
        const user = new User({
            name:     name     || 'Customer',
            email:    email    || '',
            phone:    phone    || '',
            password: password || 'otp_verified',
            gender:   gender   || '',
            dob:      dob      || '',
            address:  address  || '',
            city:     city     || '',
            pincode:  pincode  || '',
            contact:  contact  || email || phone || ''
        });
        await user.save();
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
    try {
        const { email, phone, contact } = req.body;
        let user = null;
        if (email)   user = await User.findOne({ email });
        if (!user && phone)   user = await User.findOne({ phone });
        if (!user && contact) user = await User.findOne({ contact });
        if (!user) return res.status(404).json({ message: 'User not found', exists: false });
        res.json({ message: 'User found', user, exists: true });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET /api/users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
