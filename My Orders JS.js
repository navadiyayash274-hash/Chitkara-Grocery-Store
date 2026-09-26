// ===== MY ORDERS JS — fetches real order status from MongoDB API =====

// ── Local image resolver ──────────────────────────────────────────────────────
const LOCAL_IMAGES = {
    'Apple':                        'images/images/apple.png',
    'Chilli':                       'images/images/chili.png',
    'Coca-Cola':                    'images/grocery_category_images/Coca-Cola.jpeg',
    'Coca Cola':                    'images/grocery_category_images/Coca-Cola.jpeg',
    'Thums Up':                     'images/grocery_category_images/Thums up.jpeg',
    'Sprite':                       'images/grocery_category_images/Sprite.jpeg',
    'Fanta Orange':                 'images/grocery_category_images/Fanta Orange.jpeg',
    'Maaza Mango Drink':            'images/grocery_category_images/Mazza Mango Drink.jpeg',
    'Real Mixed Fruit Juice':       'images/grocery_category_images/Real Mixed Fruit Juice.jpeg',
    'Tata Tea':                     'images/grocery_category_images/Tata Tea.jpeg',
    'Nescafé Classic Coffee':       'images/grocery_category_images/Neacafe` Classic Coffee.jpeg',
    'Bournvita':                    'images/grocery_category_images/Bournvita.jpeg',
    'Tang Orange Drink':            'images/grocery_category_images/Tang Orange Drink.jpeg',
    'India Gate Basmati Rice':      'images/grocery_category_images/India Gate Basmati Rice.jpeg',
    'Fortune Chakki Fresh Atta':    'images/grocery_category_images/Fortune Chakki Fresh Atta.jpeg',
    'Toor Dal':                     'images/grocery_category_images/Toor Dal.jpeg',
    'Moong Dal':                    'images/grocery_category_images/Moong Dal.jpeg',
    'Masoor Dal':                   'images/grocery_category_images/Masoor Dal.jpeg',
    'Chana Dal':                    'images/grocery_category_images/Chana Dal.jpeg',
    'Poha':                         'images/grocery_category_images/Poha.jpeg',
    'Suji / Rava':                  'images/grocery_category_images/Suji - Rawa.jpeg',
    'Suji Rava':                    'images/grocery_category_images/Suji - Rawa.jpeg',
    'Rajma':                        'images/grocery_category_images/Rajma.jpeg',
    'Kabuli Chana':                 'images/grocery_category_images/Kabuli Chana.jpeg',
    'Amul Butter':                  'images/grocery_category_images/Amul Butter.jpeg',
    'Amul Gold Milk':               'images/grocery_category_images/Amul Gold Mlik.jpeg',
    'Amul Taaza Milk':              'images/grocery_category_images/Amul Taza Mlik.jpg',
    'Amul Masti Dahi':              'images/grocery_category_images/Amul Masti Dahi.jpeg',
    'Amul Malai Paneer':            'images/grocery_category_images/Amul Malai Panner.jpeg',
    'Amul Paneer':                  'images/grocery_category_images/Amul Malai Panner.jpeg',
    'Amul Cheese Slices':           'images/grocery_category_images/Amul Chesse Slices.jpeg',
    'Amul Cheese Block':            'images/grocery_category_images/Amul Cheese Block.jpeg',
    'Amul Cheese':                  'images/grocery_category_images/Amul Cheese Block.jpeg',
    'Amul Fresh Cream':             'images/grocery_category_images/Amul Fresh Cream.jpeg',
    'Amul Lassi':                   'images/grocery_category_images/Amul Lassi.jpeg',
    'Amul Buttermilk':              'images/grocery_category_images/Amul Buttermlik.jpeg',
    'Parle-G Biscuits':             'images/grocery_category_images/Parle-G Biscuits.jpeg',
    'Britannia Good Day':           'images/grocery_category_images/britannia Good Day.jpeg',
    'Britannia Marie Gold':         'images/grocery_category_images/Britannia Marie Gold.jpeg',
    'Britannia Bourbon':            'images/grocery_category_images/Britannia Bourbon.jpeg',
    'Britannia NutriChoice':        'images/grocery_category_images/Britannia Nutrichoice.jpeg',
    'Oreo Original':                'images/grocery_category_images/Oreo Original.jpeg',
    'Sunfeast Dark Fantasy':        'images/grocery_category_images/Sunfeast Dark Fantasy.jpeg',
    'Sunfeast Marie Light':         'images/grocery_category_images/Sunfeast Marie Light.jpeg',
    'Hide & Seek':                  'images/grocery_category_images/Hide & Seek.jpeg',
    'KrackJack':                    'images/grocery_category_images/Krackjack.jpeg',
    'Surf Excel Matic Detergent':   'images/household-cleaning/surf-excel-matic-detergent.jpg',
    'Ariel Matic Detergent':        'images/household-cleaning/ariel-matic-detergent.jpg',
    'Tide Plus Detergent':          'images/household-cleaning/tide-plus-detergent.jpg',
    'Rin Detergent Powder':         'images/household-cleaning/rin-detergent-powder.jpg',
    'Vim Dishwash Liquid':          'images/household-cleaning/vim-dishwash-liquid.jpg',
    'Vim Dishwash Bar':             'images/household-cleaning/vim-dishwash-bar.jpg',
    'Harpic Toilet Cleaner':        'images/household-cleaning/harpic-toilet-cleaner.jpg',
    'Domex Toilet Cleaner':         'images/household-cleaning/domex-toilet-cleaner.jpg',
    'Lizol Floor Cleaner':          'images/household-cleaning/lizol-floor-cleaner.jpg',
};

function resolveImage(img, name) {
    if (img && !img.startsWith('http')) return img;
    const key = (name || '').replace(/\s*\(.*?\)\s*/g, '').trim();
    const keyLower = key.toLowerCase();
    if (LOCAL_IMAGES[key]) return LOCAL_IMAGES[key];
    for (const [k, v] of Object.entries(LOCAL_IMAGES)) {
        if (k.toLowerCase() === keyLower) return v;
    }
    for (const [k, v] of Object.entries(LOCAL_IMAGES)) {
        if (keyLower.includes(k.toLowerCase()) || k.toLowerCase().includes(keyLower)) return v;
    }
    return 'images/images/apple.png';
}

// ── Status config ─────────────────────────────────────────────────────────────
function statusConfig(status) {
    const map = {
        'Pending':          { label: '⏳ Pending',          cls: 'pending',   color: '#fdcc0d', bg: 'rgba(253,204,13,0.12)',   border: 'rgba(253,204,13,0.3)'  },
        'Accepted':         { label: '✅ Confirmed',         cls: 'confirmed', color: '#4eb060', bg: 'rgba(78,176,96,0.12)',    border: 'rgba(78,176,96,0.3)'   },
        'Confirmed':        { label: '✅ Confirmed',         cls: 'confirmed', color: '#4eb060', bg: 'rgba(78,176,96,0.12)',    border: 'rgba(78,176,96,0.3)'   },
        'Rejected':         { label: '❌ Rejected',          cls: 'rejected',  color: '#ff6b6b', bg: 'rgba(255,80,80,0.12)',    border: 'rgba(255,80,80,0.3)'   },
        'Cancelled':        { label: '🚫 Cancelled',         cls: 'cancelled', color: '#9ca3af', bg: 'rgba(156,163,175,0.12)',  border: 'rgba(156,163,175,0.3)' },
        'Return Requested': { label: '↩ Return Requested',  cls: 'return',    color: '#29b6f6', bg: 'rgba(41,182,246,0.12)',   border: 'rgba(41,182,246,0.3)'  },
    };
    return map[status] || { label: status || 'Unknown', cls: 'pending', color: '#9ca3af', bg: 'rgba(156,163,175,0.1)', border: 'rgba(156,163,175,0.3)' };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function escapeHtml(v) {
    return String(v || '').replace(/[&<>"']/g, c =>
        ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[c])
    );
}
function formatDate(v) {
    return v ? new Date(v).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '--';
}

// ── DOM refs ──────────────────────────────────────────────────────────────────
const contact      = localStorage.getItem('cgs_user_contact') ||
                     localStorage.getItem('cgs_email') ||
                     localStorage.getItem('cgs_phone') || '';

const container    = document.getElementById('orders-container');
const statTotal    = document.getElementById('stat-total');
const statAmount   = document.getElementById('stat-amount');
const statItems    = document.getElementById('stat-items');

// ── Main load ─────────────────────────────────────────────────────────────────
async function loadOrders() {
    if (!contact) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">🔐</div>
                <h3>Sign In Required</h3>
                <p>Please sign in to view your orders.</p>
                <a href="Login And Registration HTML.html">🔐 Sign In</a>
            </div>`;
        return;
    }

    container.innerHTML = `<div style="text-align:center;padding:60px;color:#9ca3af;">
        <span style="font-size:2rem;display:block;margin-bottom:10px;animation:spin 1s linear infinite">⏳</span>
        Loading your orders…
    </div>`;

    try {
        const res = await fetch('/api/orders/customer/' + encodeURIComponent(contact) + '/history');
        if (!res.ok) throw new Error('Could not fetch orders');
        const orders = await res.json();

        if (!orders.length) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="icon">📦</div>
                    <h3>No Orders Yet</h3>
                    <p>You haven't placed any orders yet.<br>Start shopping to see your orders here!</p>
                    <a href="Home Page HTML.html">🛒 Start Shopping</a>
                </div>`;
            return;
        }

        // Update stats
        let totalSpent = 0, totalItems = 0;
        orders.forEach(o => {
            totalSpent += Number(o.grandTotal || 0);
            totalItems += (o.items || []).reduce((s, i) => s + (i.qty || 0), 0);
        });
        if (statTotal)  statTotal.textContent  = orders.length;
        if (statAmount) statAmount.textContent = 'Rs.' + totalSpent.toLocaleString('en-IN');
        if (statItems)  statItems.textContent  = totalItems;

        // Render cards
        container.innerHTML = orders.map((order, idx) => orderCard(order, idx)).join('');

        // Bind expand toggles
        container.querySelectorAll('.order-header').forEach(h => {
            h.addEventListener('click', () => {
                const body    = h.nextElementSibling;
                const chevron = h.querySelector('.order-chevron');
                body.classList.toggle('open');
                chevron.classList.toggle('open');
            });
        });

        // Bind cancel/return buttons
        container.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                handleOrderAction(btn.dataset.orderId, btn.dataset.action);
            });
        });

    } catch (err) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">⚠️</div>
                <h3>Could Not Load Orders</h3>
                <p>Make sure the server is running at <strong>http://localhost:5000</strong></p>
                <a href="javascript:loadOrders()">🔄 Try Again</a>
            </div>`;
    }
}

// ── Build order card HTML ─────────────────────────────────────────────────────
function orderCard(order, idx) {
    const sc       = statusConfig(order.status);
    const isRejected  = order.status === 'Rejected';
    const isPending   = order.status === 'Pending';
    const isConfirmed = order.status === 'Accepted' || order.status === 'Confirmed';
    const canCancel   = isPending;
    const canReturn   = isConfirmed;

    const statusBadge = `
        <span style="
            padding:5px 14px; border-radius:20px; font-size:0.78rem; font-weight:700;
            background:${sc.bg}; color:${sc.color}; border:1px solid ${sc.border};
            white-space:nowrap;
        ">${sc.label}</span>`;

    // Rejection reason banner
    const rejectionBanner = isRejected && order.rejectionReason ? `
        <div style="
            margin:0 24px 0 24px; padding:12px 16px;
            background:rgba(255,80,80,0.08); border:1px solid rgba(255,80,80,0.3);
            border-radius:12px; display:flex; align-items:flex-start; gap:10px;
        ">
            <span style="font-size:1.2rem;flex-shrink:0;">❌</span>
            <div>
                <div style="color:#ff6b6b;font-weight:700;font-size:0.85rem;margin-bottom:2px;">
                    Order Rejected by Admin
                </div>
                <div style="color:#e0e0e0;font-size:0.82rem;">
                    Reason: ${escapeHtml(order.rejectionReason)}
                </div>
            </div>
        </div>` : '';

    // Pending notice
    const pendingBanner = isPending ? `
        <div style="
            margin:0 24px 0 24px; padding:12px 16px;
            background:rgba(253,204,13,0.08); border:1px solid rgba(253,204,13,0.3);
            border-radius:12px; display:flex; align-items:center; gap:10px;
        ">
            <span style="font-size:1.2rem;">⏳</span>
            <div style="color:#fdcc0d;font-size:0.83rem;font-weight:600;">
                Your order is waiting for admin approval. You will see an update here once confirmed or rejected.
            </div>
        </div>` : '';

    // Items HTML
    const itemsHTML = (order.items || []).map(item => {
        const imgSrc = resolveImage(item.img, item.name);
        return `
            <div class="order-item">
                <img src="${imgSrc}" alt="${escapeHtml(item.name)}"
                     onerror="this.onerror=null;this.src='images/images/apple.png';">
                <div class="order-item-info">
                    <h5>${escapeHtml(item.name)}</h5>
                    <p>Qty: ${item.qty} × Rs. ${item.price}</p>
                </div>
                <span class="order-item-price">Rs. ${Number(item.qty || 1) * Number(item.price || 0)}</span>
            </div>`;
    }).join('') || '<p style="color:#9ca3af;padding:8px 0;">No items</p>';

    // Action buttons
    const actionBtns = [
        canCancel ? `<button class="order-action-btn cancel-btn" data-order-id="${escapeHtml(order.orderId)}" data-action="cancel">🚫 Cancel Order</button>` : '',
        canReturn ? `<button class="order-action-btn return-btn" data-order-id="${escapeHtml(order.orderId)}" data-action="return">↩ Request Return</button>` : '',
    ].filter(Boolean).join('');

    return `
    <div class="order-card" style="animation-delay:${idx * 0.08}s">
        <div class="order-header">
            <div class="order-id-block">
                <h4>${escapeHtml(order.orderId)}</h4>
                <p>${formatDate(order.createdAt)} · Invoice: ${escapeHtml(order.invoiceNo)}</p>
            </div>
            <div class="order-meta">
                ${statusBadge}
                <span class="price">Rs. ${Number(order.grandTotal||0).toLocaleString('en-IN')}</span>
            </div>
            <span class="order-chevron">▼</span>
        </div>

        ${rejectionBanner}
        ${pendingBanner}

        <div class="order-body">
            <div class="order-items">${itemsHTML}</div>
            <div class="order-footer">
                <div class="order-footer-item">
                    <div class="lbl">Payment</div>
                    <div class="val">${escapeHtml(order.payment?.method || '--')}</div>
                </div>
                <div class="order-footer-item">
                    <div class="lbl">Delivery Date</div>
                    <div class="val">${escapeHtml(order.delivery?.date || '--')}</div>
                </div>
                <div class="order-footer-item">
                    <div class="lbl">Invoice No</div>
                    <div class="val">${escapeHtml(order.invoiceNo || '--')}</div>
                </div>
                <div class="order-footer-item">
                    <div class="lbl">Address</div>
                    <div class="val">${escapeHtml(order.customer?.address || '--')}</div>
                </div>
                <div class="order-footer-item">
                    <div class="lbl">GST (5%)</div>
                    <div class="val">Rs. ${order.gst || 0}</div>
                </div>
                <div class="order-footer-item">
                    <div class="lbl">Total</div>
                    <div class="val" style="color:#4eb060;font-weight:800;">Rs. ${Number(order.grandTotal||0).toLocaleString('en-IN')}</div>
                </div>
            </div>
            ${actionBtns ? `<div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap;">${actionBtns}</div>` : ''}
        </div>
    </div>`;
}

// ── Cancel / Return ───────────────────────────────────────────────────────────
async function handleOrderAction(orderId, action) {
    const msg = action === 'cancel'
        ? 'Are you sure you want to cancel this order?'
        : 'Submit a return request for this order?';
    if (!confirm(msg)) return;

    try {
        const res = await fetch('/api/orders/customer/' + encodeURIComponent(orderId) + '/action', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contact, action })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        alert('✅ ' + data.message);
        loadOrders();
    } catch(e) {
        alert('❌ ' + e.message);
    }
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────
loadOrders();
