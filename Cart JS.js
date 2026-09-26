// ===== CART JS — Core cart logic using localStorage =====

// Get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cgs_cart')) || [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('cgs_cart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(name, price, img, originalPrice, variantLabel = '') {
    // Use the image actually displayed on the clicked card. Some category pages
    // replace their initial image URL after loading their product data.
    const activeCard = document.activeElement?.closest('.product-card');
    const displayedImage = activeCard?.querySelector('img')?.currentSrc;
    if (displayedImage) img = displayedImage;

    let cart = getCart();
    const itemName = variantLabel ? `${name} (${variantLabel})` : name;
    const existing = cart.find(item => item.name === itemName && item.img === img);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            name: itemName,
            productName: name,
            variantLabel,
            price,
            img,
            qty: 1,
            originalPrice: originalPrice || price
        });
    }
    saveCart(cart);
    updateCartBadge();
    showToast(itemName + ' added to cart!');
}

// Remove item from cart
function removeFromCart(name) {
    let cart = getCart().filter(item => item.name !== name);
    saveCart(cart);
    updateCartBadge();
}

// Update quantity
function updateQty(name, qty) {
    let cart = getCart();
    const item = cart.find(i => i.name === name);
    if (item) {
        item.qty = parseInt(qty);
        if (item.qty <= 0) {
            cart = cart.filter(i => i.name !== name);
        }
    }
    saveCart(cart);
    renderCart();
    updateCartBadge();
}

// Get total count of items
function getCartCount() {
    return getCart().reduce((sum, item) => sum + item.qty, 0);
}

// Get total price
function getCartTotal() {
    return getCart().reduce((sum, item) => sum + (item.price * item.qty), 0);
}

// Update cart badge number in nav
function updateCartBadge() {
    const badge = document.querySelector('.cart span');
    if (badge) badge.textContent = getCartCount();
}

// Show toast notification
function showToast(message) {
    let toast = document.getElementById('cart-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'cart-toast';
        toast.style.cssText = `
            position: fixed; bottom: 30px; right: 30px;
            background: linear-gradient(135deg, #4eb060, #2e7d32);
            color: white; padding: 14px 24px;
            border-radius: 12px; font-family: Poppins, sans-serif;
            font-size: 0.95rem; font-weight: 500;
            box-shadow: 0 8px 25px rgba(78,176,96,0.5);
            z-index: 9999; opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(toast);
    }
    toast.textContent = '🛒 ' + message;
    toast.style.opacity = '1';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}

// Render cart items on Shopping Cart page
function renderCart() {
    const productsDiv = document.querySelector('.products');
    const totalPriceEl = document.getElementById('cart-total-price');
    const totalItemsEl = document.getElementById('cart-total-items');
    const totalSaveEl  = document.getElementById('cart-total-save');

    if (!productsDiv) return;

    const cart = getCart();
    productsDiv.innerHTML = '';

    if (cart.length === 0) {
        productsDiv.innerHTML = `
            <div style="text-align:center; padding: 60px 20px; color: #81c784;">
                <h2 style="font-size:2rem;">🛒 Your cart is empty</h2>
                <p style="margin-top:10px;">Go back to <a href="Home Page HTML.html" style="color:#4eb060;">Home Page</a> to add items.</p>
            </div>`;
        if (totalPriceEl) totalPriceEl.textContent = 'Rs. 0';
        if (totalItemsEl) totalItemsEl.textContent = '0';
        if (totalSaveEl)  totalSaveEl.textContent  = 'Rs. 0';
        return;
    }

    cart.forEach(item => {
        const displayName = item.productName || item.name;
        const labelText = item.variantLabel ? ` (${item.variantLabel})` : '';
        const div = document.createElement('div');
        div.className = 'product';
        const imgSrc = item.img || '';

        div.innerHTML = `
            <img src="${imgSrc}" alt="${displayName}"
                 onerror="this.onerror=null; this.src='images/images/apple.png';"
                 style="width:100px; height:100px; object-fit:contain;">
            <div class="product-info">
                <h3 class="product-name">${displayName}${labelText}</h3>
                <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
                    ${item.originalPrice && item.originalPrice !== item.price ? `<h4 style="text-decoration:line-through; color:#9ca3af; font-size:0.9rem;">Rs. ${item.originalPrice}</h4>` : ''}
                    <h4 class="product-price">Rs. ${item.price}</h4>
                    ${item.originalPrice && item.originalPrice !== item.price ? `<span style="background:rgba(253,204,13,0.15);color:#fdcc0d;border:1px solid rgba(253,204,13,0.3);border-radius:20px;padding:2px 10px;font-size:0.75rem;font-weight:700;">15% OFF</span>` : ''}
                </div>
                <p class="product-quantity">
                    Qty:
                    <input type="number" value="${item.qty}" min="1"
                        onchange="updateQty('${item.name}', this.value)"
                        style="width:55px; padding:4px; border-radius:6px; border:1px solid #4eb060; background:transparent; color:inherit;">
                </p>
                <p class="product-remove" onclick="removeFromCart('${item.name}'); renderCart();" style="cursor:pointer;">
                    🗑 <span class="remove">Remove</span>
                </p>
            </div>`;
        productsDiv.appendChild(div);
    });

    const total = getCartTotal();
    const count = getCartCount();
    if (totalPriceEl) totalPriceEl.textContent = 'Rs. ' + total;
    if (totalItemsEl) totalItemsEl.textContent = count;
    if (totalSaveEl)  totalSaveEl.textContent  = 'Rs. 0';
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    renderCart();
});
