const fs = require('fs');
const path = require('path');

const imagesRoot = path.join(__dirname, '..', 'images');
const PRODUCT_IMAGES = {};

function indexImages(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            indexImages(fullPath);
        } else if (/\.(avif|gif|jpe?g|png|webp)$/i.test(entry.name)) {
            const relativePath = path.relative(path.join(__dirname, '..'), fullPath).split(path.sep).join('/');
            const key = path.parse(entry.name).name;
            if (!PRODUCT_IMAGES[key]) PRODUCT_IMAGES[key] = `/${relativePath}`;
        }
    }
}

if (fs.existsSync(imagesRoot)) indexImages(imagesRoot);

module.exports = { PRODUCT_IMAGES };
