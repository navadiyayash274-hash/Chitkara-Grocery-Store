const express  = require('express');
const router   = express.Router();
const Feedback = require('../models/Feedback');
const { requireAdmin } = require('../middleware/adminAuth');

// Auto-reply messages
const AUTO_REPLY_LOW  = 'Sorry for our inconvenience. We will work hard to give you the best services next time. Thank You! 🙏';
const AUTO_REPLY_HIGH = 'Thank you for your feedback! We are glad you had a great experience. Your support means a lot to us. 😊';

// ── POST /api/feedback — save feedback + auto-reply for ≤2 stars ──────────────
router.post('/', async (req, res) => {
    try {
        const { name, email, userContact, rating, message, category } = req.body;

        const isLowRating = parseInt(rating) <= 2;
        const feedback = new Feedback({
            name,
            email,
            userContact: userContact || email || '',
            rating:      parseInt(rating) || 0,
            message,
            category:    category || '',
            // Auto-reply immediately for ≤2 stars
            adminReply:  isLowRating ? AUTO_REPLY_LOW : null,
            repliedAt:   isLowRating ? new Date() : null,
            autoReplied: isLowRating
        });

        await feedback.save();
        res.status(201).json({
            message:     'Feedback submitted successfully',
            feedback,
            autoReply:   isLowRating ? AUTO_REPLY_LOW : null
        });
    } catch (err) {
        console.error('Feedback save error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// ── GET /api/feedback — all feedbacks (admin) ─────────────────────────────────
router.get('/', requireAdmin, async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// ── GET /api/feedback/user/:contact — feedbacks for a specific user ───────────
router.get('/user/:contact', async (req, res) => {
    try {
        const contact = decodeURIComponent(req.params.contact);
        const feedbacks = await Feedback.find({
            $or: [
                { userContact: contact },
                { email: contact }
            ]
        }).sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// ── PATCH /api/feedback/:id/reply — admin sends a reply ──────────────────────
router.patch('/:id/reply', requireAdmin, async (req, res) => {
    try {
        const { reply } = req.body;
        if (!reply || !reply.trim()) {
            return res.status(400).json({ message: 'Reply message is required' });
        }

        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            {
                adminReply:  reply.trim(),
                repliedAt:   new Date(),
                autoReplied: false
            },
            { new: true }
        );

        if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
        res.json({ message: 'Reply sent successfully', feedback });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
