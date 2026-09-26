const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, default: '' },
    category: { type: String, default: 'Beverages' },
    quantity: { type: String, default: '' },
    price: { type: Number, required: true },
    originalPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5 },
    reviews: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
