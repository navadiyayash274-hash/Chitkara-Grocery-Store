require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const beverages = require('../seed/beverages');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    try {
      await Product.deleteMany({ category: 'Beverages' });
      await Product.insertMany(beverages);
      console.log(`✅ Seeded ${beverages.length} beverage products into MongoDB.`);
    } catch (error) {
      console.error('❌ Beverage seeding failed:', error.message);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  });
