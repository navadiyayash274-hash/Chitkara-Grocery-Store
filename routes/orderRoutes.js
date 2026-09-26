const express = require('express');
const router  = express.Router();
const Order   = require('../models/Order');
const { requireAdmin } = require('../middleware/adminAuth');
const { PRODUCT_IMAGES } = require('../scripts/productImages');

// ── Fix broken/external image URLs in order items ─────────────────────────────
function fixOrderImages(order) {
    const obj = order.toObject ? order.toObject() : { ...order };
    obj.items = (obj.items || []).map(item => {
        if (!item.img || item.img.startsWith('http')) {
            const name      = (item.name || '').trim();
            const nameLower = name.toLowerCase();
            if (PRODUCT_IMAGES[name]) {
                item.img = PRODUCT_IMAGES[name];
            } else {
                const exactKey = Object.keys(PRODUCT_IMAGES).find(k => k.toLowerCase() === nameLower);
                if (exactKey) {
                    item.img = PRODUCT_IMAGES[exactKey];
                } else {
                    const partialKey = Object.keys(PRODUCT_IMAGES).find(
                        k => nameLower.includes(k.toLowerCase()) || k.toLowerCase().includes(nameLower)
                    );
                    if (partialKey) item.img = PRODUCT_IMAGES[partialKey];
                }
            }
        }
        return item;
    });
    return obj;
}

// ── POST /api/orders — save new order (always Pending) ───────────────────────
router.post('/', async (req, res) => {
    try {
        const { orderId, invoiceNo, customer, delivery, items, subtotal, gst, grandTotal, payment } = req.body;

        // Normalize image paths before saving
        const fixedItems = (items || []).map(item => {
            if (!item.img || item.img.startsWith('http')) {
                const name      = (item.name || '').trim();
                const nameLower = name.toLowerCase();
                if (PRODUCT_IMAGES[name]) {
                    item.img = PRODUCT_IMAGES[name];
                } else {
                    const exactKey = Object.keys(PRODUCT_IMAGES).find(k => k.toLowerCase() === nameLower);
                    if (exactKey) {
                        item.img = PRODUCT_IMAGES[exactKey];
                    } else {
                        const partialKey = Object.keys(PRODUCT_IMAGES).find(
                            k => nameLower.includes(k.toLowerCase()) || k.toLowerCase().includes(nameLower)
                        );
                        if (partialKey) item.img = PRODUCT_IMAGES[partialKey];
                    }
                }
            }
            return item;
        });

        const order = new Order({
            orderId, invoiceNo, customer, delivery,
            items: fixedItems, subtotal, gst, grandTotal, payment,
            status: 'Pending'   // always starts Pending — never auto-accepted
        });

        await order.save();
        res.status(201).json({ message: 'Order saved successfully', order });
    } catch (err) {
        console.error('❌ Order save failed:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// ── GET /api/orders — all orders (admin) ─────────────────────────────────────
router.get('/', requireAdmin, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders.map(fixOrderImages));
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// ── GET /api/orders/customer/:contact/history ────────────────────────────────
router.get('/customer/:contact/history', async (req, res) => {
    try {
        const contact = decodeURIComponent(req.params.contact);
        const orders = await Order.find({
            $or: [{ 'customer.email': contact }, { 'customer.phone': contact }]
        }).sort({ createdAt: -1 });
        res.json(orders.map(fixOrderImages));
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// ── GET /api/orders/customer/:contact — latest order ─────────────────────────
router.get('/customer/:contact', async (req, res) => {
    try {
        const contact = decodeURIComponent(req.params.contact);
        const order = await Order.findOne({
            $or: [{ 'customer.email': contact }, { 'customer.phone': contact }]
        }).sort({ createdAt: -1 });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(fixOrderImages(order));
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// ── PATCH /api/orders/customer/:orderId/action — cancel or return ─────────────
router.patch('/customer/:orderId/action', async (req, res) => {
    try {
        const { contact, action } = req.body;
        if (!contact || !['cancel', 'return'].includes(action)) {
            return res.status(400).json({ message: 'Invalid customer order action' });
        }
        const order = await Order.findOne({
            orderId: req.params.orderId,
            $or: [{ 'customer.email': contact }, { 'customer.phone': contact }]
        });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (action === 'cancel' && !['Pending', 'Accepted'].includes(order.status)) {
            return res.status(400).json({ message: 'This order cannot be cancelled now' });
        }
        if (action === 'return' && !['Confirmed', 'Accepted'].includes(order.status)) {
            return res.status(400).json({ message: 'This order is not eligible for return' });
        }
        order.status = action === 'cancel' ? 'Cancelled' : 'Return Requested';
        await order.save();
        res.json({ message: action === 'cancel' ? 'Order cancelled successfully' : 'Return request submitted', order });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// ── GET /api/orders/:id — single order (admin) ───────────────────────────────
router.get('/:id', requireAdmin, async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.id });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(fixOrderImages(order));
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// ── PATCH /api/orders/:id/status — accept / reject (admin) ───────────────────
router.patch('/:id/status', requireAdmin, async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;
        if (!['Accepted', 'Rejected', 'Confirmed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid order status' });
        }

        const update = { status };
        if (status === 'Accepted') update.acceptedAt = new Date();
        if (status === 'Rejected') {
            update.rejectedAt      = new Date();
            update.rejectionReason = rejectionReason || null;
        }

        const order = await Order.findOneAndUpdate(
            { orderId: req.params.id },
            update,
            { new: true, runValidators: true }
        );
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json({ message: `Order ${status.toLowerCase()}`, order });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
