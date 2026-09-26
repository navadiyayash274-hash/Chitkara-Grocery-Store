require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const snacksBiscuits = require('../seed/snacks-biscuits');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    try {
      await Product.deleteMany({ category: 'Snacks & Biscuits' });
      await Product.insertMany(snacksBiscuits);
      console.log(`✅ Seeded ${snacksBiscuits.length} Snacks & Biscuits products into MongoDB.`);
    } catch (error) {
      console.error('❌ Snacks & Biscuits seeding failed:', error.message);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  });
