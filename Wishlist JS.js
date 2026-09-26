// ===== WISHLIST JS — localStorage based wishlist =====

// Local image resolver — maps product names to local paths when external URLs fail
const WISHLIST_LOCAL_IMAGES = {
    'Coca-Cola':                    '/images/grocery_category_images/Coca-Cola.jpeg',
    'Thums Up':                     '/images/grocery_category_images/Thums up.jpeg',
    'Sprite':                       '/images/grocery_category_images/Sprite.jpeg',
    'Fanta Orange':                 '/images/grocery_category_images/Fanta Orange.jpeg',
    'Maaza Mango Drink':            '/images/grocery_category_images/Mazza Mango Drink.jpeg',
    'Real Mixed Fruit Juice':       '/images/grocery_category_images/Real Mixed Fruit Juice.jpeg',
    'Tata Tea':                     '/images/grocery_category_images/Tata Tea.jpeg',
    'Nescafé Classic Coffee':       '/images/grocery_category_images/Neacafe` Classic Coffee.jpeg',
    'Bournvita':                    '/images/grocery_category_images/Bournvita.jpeg',
    'Tang Orange Drink':            '/images/grocery_category_images/Tang Orange Drink.jpeg',
    'India Gate Basmati Rice':      '/images/grocery_category_images/India Gate Basmati Rice.jpeg',
    'Fortune Chakki Fresh Atta':    '/images/grocery_category_images/Fortune Chakki Fresh Atta.jpeg',
    'Toor Dal':                     '/images/grocery_category_images/Toor Dal.jpeg',
    'Moong Dal':                    '/images/grocery_category_images/Moong Dal.jpeg',
    'Masoor Dal':                   '/images/grocery_category_images/Masoor Dal.jpeg',
    'Chana Dal':                    '/images/grocery_category_images/Chana Dal.jpeg',
    'Poha':                         '/images/grocery_category_images/Poha.jpeg',
    'Suji / Rava':                  '/images/grocery_category_images/Suji - Rawa.jpeg',
    'Rajma':                        '/images/grocery_category_images/Rajma.jpeg',
    'Kabuli Chana':                 '/images/grocery_category_images/Kabuli Chana.jpeg',
    'Amul Butter':                  '/images/grocery_category_images/Amul Butter.jpeg',
    'Amul Gold Milk':               '/images/grocery_category_images/Amul Gold Mlik.jpeg',
    'Amul Taaza Milk':              '/images/grocery_category_images/Amul Taza Mlik.jpg',
    'Amul Masti Dahi':              '/images/grocery_category_images/Amul Masti Dahi.jpeg',
    'Amul Malai Paneer':            '/images/grocery_category_images/Amul Malai Panner.jpeg',
    'Amul Cheese Slices':           '/images/grocery_category_images/Amul Chesse Slices.jpeg',
    'Amul Cheese Block':            '/images/grocery_category_images/Amul Cheese Block.jpeg',
    'Amul Fresh Cream':             '/images/grocery_category_images/Amul Fresh Cream.jpeg',
    'Amul Lassi':                   '/images/grocery_category_images/Amul Lassi.jpeg',
    'Amul Buttermilk':              '/images/grocery_category_images/Amul Buttermlik.jpeg',
    'Parle-G Biscuits':             '/images/grocery_category_images/Parle-G Biscuits.jpeg',
    'Britannia Good Day':           '/images/grocery_category_images/britannia Good Day.jpeg',
    'Britannia Marie Gold':         '/images/grocery_category_images/Britannia Marie Gold.jpeg',
    'Britannia Bourbon':            '/images/grocery_category_images/Britannia Bourbon.jpeg',
    'Britannia NutriChoice':        '/images/grocery_category_images/Britannia Nutrichoice.jpeg',
    'Oreo Original':                '/images/grocery_category_images/Oreo Original.jpeg',
    'Sunfeast Dark Fantasy':        '/images/grocery_category_images/Sunfeast Dark Fantasy.jpeg',
    'Sunfeast Marie Light':         '/images/grocery_category_images/Sunfeast Marie Light.jpeg',
    'Hide & Seek':                  '/images/grocery_category_images/Hide & Seek.jpeg',
    'KrackJack':                    '/images/grocery_category_images/Krackjack.jpeg',
    'Apple':                        'images/images/apple.png',
    'Chilli':                       'images/images/chili.png',
    'Amul Paneer':                  '/images/grocery_category_images/Amul Malai Panner.jpeg',
    'Amul Cheese':                  '/images/grocery_category_images/Amul Cheese Block.jpeg',
    'Coca Cola':                    '/images/grocery_category_images/Coca-Cola.jpeg',
    'Surf Excel Matic Detergent':   '/images/household-cleaning/surf-excel-matic-detergent.jpg',
    'Ariel Matic Detergent':        '/images/household-cleaning/ariel-matic-detergent.jpg',
    'Vim Dishwash Liquid':          '/images/household-cleaning/vim-dishwash-liquid.jpg',
    'Harpic Toilet Cleaner':        '/images/household-cleaning/harpic-toilet-cleaner.jpg',
};

function resolveWishlistImage(img, name) {
    if (img && !img.startsWith('http')) return img;
    const key = (name || '').replace(/\s*\(.*?\)\s*/g, '').trim();
    const keyLower = key.toLowerCase();
    if (WISHLIST_LOCAL_IMAGES[key]) return WISHLIST_LOCAL_IMAGES[key];
    for (const [k, v] of Object.entries(WISHLIST_LOCAL_IMAGES)) {
        if (k.toLowerCase() === keyLower) return v;
    }
    for (const [k, v] of Object.entries(WISHLIST_LOCAL_IMAGES)) {
        if (keyLower.includes(k.toLowerCase()) || k.toLowerCase().includes(keyLower)) return v;
    }
    return 'images/images/apple.png';
}

// Get wishlist from localStorage
function getWishlist() {
    return JSON.parse(localStorage.getItem('cgs_wishlist')) || [];
}

// Save wishlist
function saveWishlist(wishlist) {
    localStorage.setItem('cgs_wishlist', JSON.stringify(wishlist));
}

// Toggle wishlist — add if not present, remove if already there
function toggleWishlist(name, price, img, btn) {
    let wishlist = getWishlist();
    const exists = wishlist.find(item => item.name === name);

    if (exists) {
        // Remove from wishlist
        wishlist = wishlist.filter(item => item.name !== name);
        saveWishlist(wishlist);
        updateHeartBtn(btn, false);
        showWishlistToast(name + ' removed from wishlist', false);
    } else {
        // Add to wishlist
        wishlist.push({ name, price, img });
        saveWishlist(wishlist);
        updateHeartBtn(btn, true);
        showWishlistToast(name + ' added to wishlist ❤️', true);
    }

    updateWishlistBadge();
}

// Update heart button appearance
function updateHeartBtn(btn, isWishlisted) {
    if (!btn) return;
    if (isWishlisted) {
        btn.style.color = '#ff6c57';
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#ff6c57" stroke="#ff6c57" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
        btn.title = 'Remove from Wishlist';
    } else {
        btn.style.color = '';
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
        btn.title = 'Add to Wishlist';
    }
}

// Update wishlist badge count in nav
function updateWishlistBadge() {
    const count = getWishlist().length;
    const badge = document.getElementById('wishlist-count');
    if (badge) badge.textContent = count;
}

// Show toast notification
function showWishlistToast(message, isAdd) {
    let toast = document.getElementById('wishlist-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'wishlist-toast';
        toast.style.cssText = `
            position: fixed; bottom: 30px; left: 30px;
            color: white; padding: 14px 24px;
            border-radius: 12px; font-family: Poppins, sans-serif;
            font-size: 0.92rem; font-weight: 500;
            z-index: 9999; opacity: 0;
            transition: opacity 0.3s ease;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(toast);
    }

    toast.style.background = isAdd
        ? 'linear-gradient(135deg, #ff6c57, #ff4757)'
        : 'linear-gradient(135deg, #636e72, #2d3436)';
    toast.style.boxShadow = isAdd
        ? '0 8px 25px rgba(255,108,87,0.5)'
        : '0 8px 25px rgba(0,0,0,0.3)';

    toast.textContent = message;
    toast.style.opacity = '1';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}

// Restore heart button states on page load
function restoreHeartButtons() {
    const wishlist = getWishlist();
    const wishlistNames = wishlist.map(item => item.name);

    document.querySelectorAll('.like-btn').forEach(btn => {
        const productBox = btn.closest('.product-box');
        if (!productBox) return;
        const name = productBox.querySelector('strong')?.textContent?.trim();
        if (name && wishlistNames.includes(name)) {
            updateHeartBtn(btn, true);
        }
    });
}

// Render wishlist on Wishlist page
function renderWishlist() {
    const productsDiv = document.querySelector('.products');
    const totalEl  = document.getElementById('wishlist-total');
    const countEl  = document.getElementById('wishlist-count-items');

    if (!productsDiv) return;

    const wishlist = getWishlist();
    productsDiv.innerHTML = '';

    if (wishlist.length === 0) {
        productsDiv.innerHTML = `
            <div style="text-align:center; padding:80px 20px; color:#81c784;">
                <div style="font-size:4rem; margin-bottom:15px;">💔</div>
                <h2 style="font-size:1.6rem; color:#e0e0e0; margin-bottom:10px;">Your Wishlist is Empty</h2>
                <p style="color:#9ca3af; margin-bottom:25px;">Browse products and click the ❤️ button to save them here.</p>
                <a href="Home Page HTML.html" style="background:linear-gradient(135deg,#4eb060,#2e7d32);color:white;padding:12px 30px;border-radius:30px;text-decoration:none;font-weight:700;">🛒 Start Shopping</a>
            </div>`;
        if (totalEl) totalEl.textContent = 'Rs. 0';
        if (countEl) countEl.textContent = '0';
        return;
    }

    let total = 0;

    wishlist.forEach(item => {
        total += item.price;
        const imgSrc = resolveWishlistImage(item.img, item.name);
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
            <img src="${imgSrc}" alt="${item.name}"
                 onerror="this.onerror=null; this.src='images/images/apple.png';"
                 style="width:160px;height:160px;object-fit:contain;padding:15px;background:rgba(255,255,255,0.05);">
            <div class="product-info">
                <h3 class="product-name">${item.name}</h3>
                <h4 class="product-price">Rs. ${item.price}</h4>
                <div style="display:flex; gap:10px; margin-top:10px; flex-wrap:wrap;">
                    <button onclick="moveToCart('${item.name}', ${item.price}, '${imgSrc}')"
                        style="padding:8px 20px; background:linear-gradient(135deg,#4eb060,#2e7d32); color:white; border:none; border-radius:20px; cursor:pointer; font-size:0.85rem; font-weight:600; transition:all 0.3s ease;"
                        onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform=''">
                        🛒 Add to Cart
                    </button>
                    <button onclick="removeFromWishlist('${item.name}')"
                        style="padding:8px 20px; background:rgba(255,80,80,0.1); color:#ff6b6b; border:1px solid rgba(255,80,80,0.3); border-radius:20px; cursor:pointer; font-size:0.85rem; font-weight:600; transition:all 0.3s ease;"
                        onmouseover="this.style.background='rgba(255,80,80,0.2)'" onmouseout="this.style.background='rgba(255,80,80,0.1)'">
                        🗑 Remove
                    </button>
                </div>
            </div>`;
        productsDiv.appendChild(div);
    });

    if (totalEl) totalEl.textContent = 'Rs. ' + total;
    if (countEl) countEl.textContent = wishlist.length;
}

// Remove item from wishlist and re-render
function removeFromWishlist(name) {
    let wishlist = getWishlist().filter(item => item.name !== name);
    saveWishlist(wishlist);
    updateWishlistBadge();
    renderWishlist();
    showWishlistToast(name + ' removed from wishlist', false);
}

// Move item from wishlist to cart
function moveToCart(name, price, img) {
    // Add to cart using Cart JS function
    if (typeof addToCart === 'function') {
        addToCart(name, price, img);
    } else {
        let cart = JSON.parse(localStorage.getItem('cgs_cart')) || [];
        const existing = cart.find(i => i.name === name);
        if (existing) existing.qty += 1;
        else cart.push({ name, price, img, qty: 1 });
        localStorage.setItem('cgs_cart', JSON.stringify(cart));
    }
    removeFromWishlist(name);
    showWishlistToast(name + ' moved to cart 🛒', true);
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    updateWishlistBadge();
    restoreHeartButtons();
    renderWishlist();
});
