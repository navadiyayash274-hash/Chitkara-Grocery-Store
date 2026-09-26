document.querySelector('.card-number-input').oninput = () =>{
    document.querySelector('.card-number-box').innerText = document.querySelector('.card-number-input').value;
}

document.querySelector('.card-holder-input').oninput = () =>{
    document.querySelector('.card-holder-name').innerText = document.querySelector('.card-holder-input').value;
}

document.querySelector('.month-input').oninput = () =>{
    document.querySelector('.exp-month').innerText = document.querySelector('.month-input').value;
}

document.querySelector('.year-input').oninput = () =>{
    document.querySelector('.exp-year').innerText = document.querySelector('.year-input').value;
}

document.querySelector('.cvv-input').onmouseenter = () =>{
    document.querySelector('.front').style.transform = 'perspective(1000px) rotateY(-180deg)';
    document.querySelector('.back').style.transform = 'perspective(1000px) rotateY(0deg)';
}

document.querySelector('.cvv-input').onmouseleave = () =>{
    document.querySelector('.front').style.transform = 'perspective(1000px) rotateY(0deg)';
    document.querySelector('.back').style.transform = 'perspective(1000px) rotateY(180deg)';
}

document.querySelector('.cvv-input').oninput = () =>{
    document.querySelector('.cvv-box').innerText = document.querySelector('.cvv-input').value;
}

// ===== PAYMENT TAB SWITCHING =====
function showTab(tab) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
    event.target.classList.add('active');
}

// UPI app selection
function selectUPI(el) {
    document.querySelectorAll('.upi-app').forEach(a => a.classList.remove('selected'));
    el.classList.add('selected');
}

// Bank selection
function selectBank(el) {
    document.querySelectorAll('.bank-item').forEach(b => b.classList.remove('selected'));
    el.classList.add('selected');
}

// ===== SAVE PAYMENT DETAILS TO LOCALSTORAGE =====

// Get current time string
function getPaymentTime() {
    const now = new Date();
    return now.toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: true
    });
}

// Save CARD payment
function saveCardPayment() {
    const cardHolder = document.querySelector('.card-holder-input').value || 'N/A';
    const cardNumber = document.querySelector('.card-number-input').value || '';
    const masked = cardNumber ? '**** **** **** ' + cardNumber.slice(-4) : 'N/A';
    localStorage.setItem('cgs_payment',        'Credit / Debit Card');
    localStorage.setItem('cgs_payment_detail', 'Card Holder: ' + cardHolder + ' | Card No: ' + masked);
    localStorage.setItem('cgs_payment_time',   getPaymentTime());
}

// Save UPI payment
function saveUPIPayment() {
    const upiId  = document.getElementById('upi-id') ? document.getElementById('upi-id').value || 'N/A' : 'N/A';
    const selApp = document.querySelector('.upi-app.selected');
    const appName = selApp ? selApp.querySelector('span:last-child').textContent : 'UPI';
    localStorage.setItem('cgs_payment',        'UPI — ' + appName);
    localStorage.setItem('cgs_payment_detail', 'UPI ID: ' + upiId + ' | App: ' + appName);
    localStorage.setItem('cgs_payment_time',   getPaymentTime());
}

// Save Net Banking payment
function saveNetBankingPayment() {
    const selBank = document.querySelector('.bank-item.selected');
    const bankName = selBank ? selBank.textContent.trim() : 'Net Banking';
    localStorage.setItem('cgs_payment',        'Net Banking');
    localStorage.setItem('cgs_payment_detail', 'Bank: ' + bankName);
    localStorage.setItem('cgs_payment_time',   getPaymentTime());
}

// Save COD payment
function saveCODPayment() {
    localStorage.setItem('cgs_payment',        'Cash on Delivery (COD)');
    localStorage.setItem('cgs_payment_detail', 'Pay at doorstep on delivery');
    localStorage.setItem('cgs_payment_time',   getPaymentTime());
}

// Save QR payment
function saveQRPayment() {
    localStorage.setItem('cgs_payment',        'QR Code Scan & Pay');
    localStorage.setItem('cgs_payment_detail', 'UPI ID: chitkaragrocery@upi | Chitkara Grocery Store');
    localStorage.setItem('cgs_payment_time',   getPaymentTime());
}
