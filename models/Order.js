const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    name:  { type: String, required: true },
    price: { type: Number, required: true },
    qty:   { type: Number, required: true },
    img:   { type: String, default: '' }
});

const orderSchema = new mongoose.Schema({
    orderId:   { type: String, required: true },
    invoiceNo: { type: String, required: true },

    customer: {
        name:    { type: String, required: true },
        email:   { type: String, default: '' },
        phone:   { type: String, default: '' },
        address: { type: String, default: '' },
        pincode: { type: String, default: '' }
    },

    delivery: {
        date:     { type: String, default: null },
        timeSlot: { type: String, default: null }
    },

    items:     [orderItemSchema],
    subtotal:  { type: Number, required: true },
    gst:       { type: Number, required: true },
    grandTotal:{ type: Number, required: true },

    payment: {
        method: { type: String, required: true },
        detail: { type: String, default: '' },
        time:   { type: String, default: '' }
    },

    // ── Order status ────────────────────────────────────────────────────────
    // New orders always start as 'Pending' — admin must explicitly Accept/Reject
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'Confirmed', 'Cancelled', 'Return Requested'],
        default: 'Pending'
    },

    // ── Extended status fields ───────────────────────────────────────────────
    deliveryDate:     { type: String,  default: null },
    deliveryTime:     { type: String,  default: null },
    rejectionReason:  { type: String,  default: null },
    acceptedAt:       { type: Date,    default: null },
    rejectedAt:       { type: Date,    default: null },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
