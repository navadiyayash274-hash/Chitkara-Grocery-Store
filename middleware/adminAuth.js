// Simple admin auth middleware

function createAdminToken() {
    return 'cgs-admin-' + Date.now();
}

function requireAdmin(req, res, next) {
    const token = req.headers['x-admin-token'] || '';
    if (token.startsWith('cgs-admin-')) {
        return next();
    }
    return res.status(401).json({ message: 'Unauthorized' });
}

module.exports = { createAdminToken, requireAdmin };
