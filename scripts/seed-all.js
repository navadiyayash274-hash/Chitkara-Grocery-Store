// Seed ALL categories in one go — runs beverages, household & cleaning, snacks & biscuits
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const beverages       = require('../seed/beverages');
const householdCleaning = require('../seed/household-cleaning');
const snacksBiscuits  = require('../seed/snacks-biscuits');

const allSeeds = [
  { category: 'Beverages',           data: beverages },
  { category: 'Household & Cleaning', data: householdCleaning },
  { category: 'Snacks & Biscuits',   data: snacksBiscuits }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected');
    console.log('');

    let totalInserted = 0;

    for (const { category, data } of allSeeds) {
      try {
        await Product.deleteMany({ category });
        await Product.insertMany(data);
        console.log(`✅ ${category}: removed old records, inserted ${data.length} products.`);
        totalInserted += data.length;
      } catch (err) {
        console.error(`❌ Failed to seed "${category}": ${err.message}`);
      }
    }

    console.log('');
    console.log(`🎉 Done! Total products seeded: ${totalInserted}`);
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
