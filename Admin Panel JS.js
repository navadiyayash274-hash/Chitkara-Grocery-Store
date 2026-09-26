const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');
const loginError = document.getElementById('login-error');
const tableWrap = document.getElementById('table-wrap');
const detailPanel = document.getElementById('order-details');
const statusText = document.getElementById('status');
const data = {};
let currentRange = 30;

document.getElementById('login-form').addEventListener('submit', async event => {
    event.preventDefault();
    loginError.textContent = '';
    try {
        const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: document.getElementById('admin-email').value, password: document.getElementById('admin-password').value }) });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        sessionStorage.setItem('cgs_admin', 'true');
        sessionStorage.setItem('cgs_admin_token', result.token);
        showDashboard();
    } catch (error) { loginError.textContent = error.message || 'Unable to sign in'; }
});

document.getElementById('logout').addEventListener('click', () => { sessionStorage.removeItem('cgs_admin'); sessionStorage.removeItem('cgs_admin_token'); location.reload(); });
document.querySelectorAll('#tabs button').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('#tabs button').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    render(button.dataset.type);
}));
document.querySelectorAll('[data-range]').forEach(button => button.addEventListener('click', () => {
    currentRange = Number(button.dataset.range);
    document.querySelectorAll('[data-range]').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    updateRevenue();
}));
document.getElementById('apply-dates').addEventListener('click', () => { currentRange = null; updateRevenue(); });

async function showDashboard() {
    loginView.classList.add('hidden');
    dashboardView.classList.remove('hidden');
    await loadAll();
    render('users');
}

async function loadAll() {
    statusText.textContent = 'Loading MongoDB data...';
    for (const type of ['users', 'orders', 'feedback', 'contact']) {
        const response = await fetch(`/api/${type}`, { headers: { 'x-admin-token': sessionStorage.getItem('cgs_admin_token') || '' } });
        data[type] = response.ok ? await response.json() : [];
    }
    document.getElementById('stats').innerHTML = Object.entries(data).map(([key, value]) => `<div class="stat"><span>${key}</span><strong>${value.length}</strong></div>`).join('');
    updateRevenue();
    statusText.textContent = `Updated ${new Date().toLocaleTimeString()}`;
}

function updateRevenue() {
    const fromInput = document.getElementById('date-from').value;
    const toInput = document.getElementById('date-to').value;
    const now = new Date();
    const from = fromInput ? new Date(`${fromInput}T00:00:00`) : new Date(now.getTime() - ((currentRange || 30) - 1) * 86400000);
    const to = toInput ? new Date(`${toInput}T23:59:59`) : now;
    const acceptedOrders = (data.orders || []).filter(order => order.status === 'Accepted' && new Date(order.createdAt) >= from && new Date(order.createdAt) <= to);
    const revenue = acceptedOrders.reduce((total, order) => total + Number(order.grandTotal || 0), 0);
    document.getElementById('revenue-total').textContent = `Rs. ${revenue.toLocaleString('en-IN')}`;
}

function render(type) {
    detailPanel.classList.add('hidden');
    const rows = data[type] || [];
    if (!rows.length) { tableWrap.innerHTML = '<div class="empty">No records found.</div>'; return; }
    if (type === 'orders') { renderOrders(rows); return; }
    const keys = Object.keys(rows[0]).filter(key => !['_id', '__v', 'password'].includes(key));
    tableWrap.innerHTML = `<table><thead><tr>${keys.map(key => `<th>${key}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${keys.map(key => `<td>${format(row[key])}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

function renderOrders(orders) {
    tableWrap.innerHTML = `<table><thead><tr><th>Order</th><th>Customer</th><th>Phone</th><th>Address</th><th>Items</th><th>Order value</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead><tbody>${orders.map((order, index) => `<tr><td>${format(order.orderId)}<br><small>${format(order.invoiceNo)}</small></td><td>${format(order.customer?.name)}<br><small>${format(order.customer?.email)}</small></td><td>${format(order.customer?.phone)}</td><td>${format(order.customer?.address)}<br>${format(order.customer?.pincode)}</td><td>${order.items?.length || 0}</td><td>Rs. ${Number(order.grandTotal || 0).toLocaleString('en-IN')}</td><td>${format(order.status)}</td><td>${dateText(order.createdAt)}</td><td><button class="action details-btn" data-details="${index}">Details</button><button class="action accept" data-status="Accepted" data-order="${index}">Accept</button><button class="action reject" data-status="Rejected" data-order="${index}">Reject</button></td></tr>`).join('')}</tbody></table>`;
    tableWrap.querySelectorAll('[data-details]').forEach(button => button.addEventListener('click', () => showOrder(orders[button.dataset.details])));
    tableWrap.querySelectorAll('[data-status]').forEach(button => button.addEventListener('click', () => updateOrderStatus(orders[button.dataset.order], button.dataset.status)));
}

function showOrder(order) {
    detailPanel.classList.remove('hidden');
    detailPanel.innerHTML = `<h2>Order ${format(order.orderId)}</h2><div class="detail-grid"><div><b>Customer</b>${format(order.customer?.name)}</div><div><b>Email</b>${format(order.customer?.email)}</div><div><b>Phone</b>${format(order.customer?.phone)}</div><div><b>Address</b>${format(order.customer?.address)}, ${format(order.customer?.pincode)}</div><div><b>Delivery</b>${format(order.delivery?.date)} ${format(order.delivery?.timeSlot)}</div><div><b>Payment</b>${format(order.payment?.method)} ${format(order.payment?.detail)}</div><div><b>Subtotal</b>Rs. ${format(order.subtotal)}</div><div><b>GST</b>Rs. ${format(order.gst)}</div><div><b>Order value</b>Rs. ${format(order.grandTotal)}</div><div><b>Status</b>${format(order.status)}</div></div><h3>Items</h3><p>${(order.items || []).map(item => `${format(item.name)} x ${format(item.qty)} = Rs. ${format(item.price)}`).join('<br>') || 'No items'}</p>`;
    detailPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function updateOrderStatus(order, status) {
    const action = status === 'Accepted' ? 'accept' : 'reject';
    if (!window.confirm(`Are you sure you want to ${action} order ${order.orderId}?`)) return;
    statusText.textContent = `Updating order ${order.orderId}...`;
    try {
        const response = await fetch(`/api/orders/${encodeURIComponent(order.orderId)}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'x-admin-token': sessionStorage.getItem('cgs_admin_token') || '' },
            body: JSON.stringify({ status })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Could not update order status');
        await loadAll();
        render('orders');
        statusText.textContent = `Order ${order.orderId} ${status.toLowerCase()} successfully`;
    } catch (error) {
        statusText.textContent = error.message;
    }
}

function dateText(value) { return value ? new Date(value).toLocaleString() : '-'; }
function format(value) { if (value === null || value === undefined || value === '') return '-'; if (typeof value === 'object') return JSON.stringify(value); return String(value); }
if (sessionStorage.getItem('cgs_admin') === 'true') showDashboard();
