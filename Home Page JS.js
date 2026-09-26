const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minsEl = document.getElementById("mins");
const secondsEl = document.getElementById("seconds");

// ===== MONSOON SALE: 25 July 2026 to 27 July 2026 =====
const saleStart = new Date("2026-07-25T00:00:00").getTime();
const saleEnd   = new Date("2026-07-27T23:59:59").getTime();

function countdown() {
    const now = new Date().getTime();
    const heading = document.getElementById('sale-heading-text');

    // Before sale starts
    if (now < saleStart) {
        const diff = (saleStart - now) / 1000;
        daysEl.innerHTML    = formatTime(Math.floor(diff / 3600 / 24));
        hoursEl.innerHTML   = formatTime(Math.floor(diff / 3600) % 24);
        minsEl.innerHTML    = formatTime(Math.floor(diff / 60) % 60);
        secondsEl.innerHTML = formatTime(Math.floor(diff) % 60);
        if (heading) heading.innerHTML = '⏳ Monsoon Sale is Start In';
        return;
    }

    // Sale is live
    if (now >= saleStart && now <= saleEnd) {
        const diff = (saleEnd - now) / 1000;
        daysEl.innerHTML    = formatTime(Math.floor(diff / 3600 / 24));
        hoursEl.innerHTML   = formatTime(Math.floor(diff / 3600) % 24);
        minsEl.innerHTML    = formatTime(Math.floor(diff / 60) % 60);
        secondsEl.innerHTML = formatTime(Math.floor(diff) % 60);
        if (heading) heading.innerHTML = '🌧️ Monsoon Sale is Live';
        return;
    }

    // Sale ended
    daysEl.innerHTML    = '00';
    hoursEl.innerHTML   = '00';
    minsEl.innerHTML    = '00';
    secondsEl.innerHTML = '00';
    if (heading) {
        heading.innerHTML = '';
        heading.style.display = 'none';
    }
}

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

countdown();
setInterval(countdown, 1000);

// ===== LIVE SEARCH =====
document.addEventListener('DOMContentLoaded', function () {

    const searchInput = document.querySelector('.search-input');
    const searchForm  = document.querySelector('.search-box');
    const searchMsg   = document.getElementById('search-result-msg');

    if (!searchInput) return;

    // Prevent form from refreshing the page
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        doSearch(searchInput.value.trim());
    });

    // Live search as user types
    searchInput.addEventListener('input', function () {
        doSearch(this.value.trim());
    });

    function doSearch(query) {
        const allBoxes = document.querySelectorAll('.product-box');
        const q = query.toLowerCase();
        let matchCount = 0;

        allBoxes.forEach(box => {
            const name     = box.querySelector('strong')?.textContent?.toLowerCase() || '';
            const quantity = box.querySelector('.quantity')?.textContent?.toLowerCase() || '';

            if (q === '' || name.includes(q) || quantity.includes(q)) {
                box.style.display = '';
                box.style.animation = 'searchFadeIn 0.4s ease both';
                matchCount++;
            } else {
                box.style.display = 'none';
            }
        });

        // Show result message
        const msg = document.getElementById('search-result-msg');
        if (!msg) return;

        if (q === '') {
            msg.style.display = 'none';
            msg.textContent = '';
        } else if (matchCount === 0) {
            msg.style.display = 'block';
            msg.innerHTML = `😔 No products found for <strong>"${query}"</strong>. Try a different name.`;
            msg.style.color = '#ff6b6b';
        } else {
            msg.style.display = 'block';
            msg.innerHTML = `✅ Showing <strong>${matchCount}</strong> result${matchCount > 1 ? 's' : ''} for <strong>"${query}"</strong>`;
            msg.style.color = '#4eb060';
        }
    }
});
