require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const householdCleaning = require('../seed/household-cleaning');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    try {
      await Product.deleteMany({ category: 'Household & Cleaning' });
      await Product.insertMany(householdCleaning);
      console.log(`✅ Seeded ${householdCleaning.length} household and cleaning products into MongoDB.`);
    } catch (error) {
      console.error('❌ Household & Cleaning seeding failed:', error.message);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  });
