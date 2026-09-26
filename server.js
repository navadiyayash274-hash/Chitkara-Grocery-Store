const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const path       = require('path');
const fs         = require('fs');
const { createAdminToken } = require('./middleware/adminAuth');
require('dotenv').config();

const app         = express();
const envFilePath = path.join(__dirname, '.env');
const adminRecoveryCodes = new Map();

function generateAdminRecoveryCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

function saveAdminPassword(password) {
    let envContents = fs.existsSync(envFilePath)
        ? fs.readFileSync(envFilePath, 'utf8').replace(/\r\n/g, '\n')
        : '';
    const passwordLine = `ADMIN_PASSWORD=${password}`;
    if (/^ADMIN_PASSWORD=.*$/m.test(envContents)) {
        envContents = envContents.replace(/^ADMIN_PASSWORD=.*$/m, passwordLine);
    } else {
        envContents = `${envContents.trimEnd()}\n${passwordLine}\n`;
    }
    fs.writeFileSync(envFilePath, envContents, 'utf8');
    process.env.ADMIN_PASSWORD = password;
    console.log('✅ Admin password updated and saved to .env');
}

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== API ROUTES (must come before express.static) =====
app.use('/api/orders',   require('./routes/orderRoutes'));
app.use('/api/users',    require('./routes/userRoutes'));
app.use('/api/contact',  require('./routes/contactRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));

// ===== ADMIN API =====
app.post('/api/admin/login', (req, res) => {
    const email    = process.env.ADMIN_EMAIL    || 'admin@chitkara.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    if (req.body.email === email && req.body.password === password) {
        return res.json({ message: 'Admin login successful', token: createAdminToken() });
    }
    res.status(401).json({ message: 'Invalid admin email or password' });
});

app.post('/api/admin/send-recovery-code', (req, res) => {
    const phone        = (process.env.ADMIN_PHONE || '').trim();
    const enteredPhone = String(req.body.adminPhone || '').trim();
    if (!enteredPhone) return res.status(400).json({ message: 'Mobile number is required.' });
    if (enteredPhone !== phone) return res.status(401).json({ message: 'Only the registered admin mobile number is allowed for recovery.' });

    const code = generateAdminRecoveryCode();
    adminRecoveryCodes.set(enteredPhone, { code, expiresAt: Date.now() + 5 * 60 * 1000 });
    res.json({ message: 'Recovery code sent successfully.', code, expiresInMinutes: 5 });
});

app.post('/api/admin/reset-password', (req, res) => {
    const phone        = (process.env.ADMIN_PHONE || '').trim();
    const { adminPhone, code, newPassword } = req.body;
    const enteredPhone = (adminPhone || '').trim();
    const matchesPhone = enteredPhone && enteredPhone === phone;
    const savedCode    = adminRecoveryCodes.get(enteredPhone);

    if (enteredPhone && !matchesPhone)
        return res.status(401).json({ message: 'Only the registered admin mobile number is allowed for recovery.' });
    if (!matchesPhone || !savedCode || savedCode.expiresAt < Date.now() || savedCode.code !== String(code || '').trim())
        return res.status(401).json({ message: 'Invalid admin mobile number or recovery code' });
    if (!newPassword || newPassword.length < 8)
        return res.status(400).json({ message: 'New password must be at least 8 characters' });

    try {
        adminRecoveryCodes.delete(enteredPhone);
        saveAdminPassword(newPassword);
        res.json({ message: 'Admin password reset successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Password reset failed.', error: error.message });
    }
});

// ===== STATIC FILES (after all API routes) =====
app.use(express.static(path.join(__dirname)));

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'Admin Panel HTML.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'About Us HTML.html'));
});

// ===== START SERVER =====
const PORT = parseInt(process.env.PORT) || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Connected: chitkara_grocery');
        app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
            console.log('');
            console.log('📦 API Endpoints ready:');
            console.log(`   POST/GET  /api/orders`);
            console.log(`   POST/GET  /api/users`);
            console.log(`   POST/GET  /api/feedback`);
            console.log(`   PATCH     /api/feedback/:id/reply`);
            console.log(`   POST/GET  /api/contact`);
        });
    })
    .catch(err => {
        console.error('❌ MongoDB connection failed:', err.message);
        process.exit(1);
    });
