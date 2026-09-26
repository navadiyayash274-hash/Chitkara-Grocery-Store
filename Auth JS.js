// ===== AUTH JS =====
// Flow: About Us → Login → Personal Info → Home Page

const PAGE = window.location.pathname.split('/').pop() || '';

// Public pages — no login needed
const PUBLIC = [
    'About Us HTML.html',
    'Login And Registration HTML.html',
    'Contact Form HTML.html',
    'Contact Form Confirm HTML and CSS.html',
    'Feedback Form HTML.html',
    'Feedback Form Confirm HTML and CSS.html',
    'Personal Info HTML.html'
];

const loggedIn   = localStorage.getItem('cgs_logged_in') === 'true';
const isPublic   = PUBLIC.some(p => PAGE === p || PAGE === '');

// If protected page and not logged in → redirect to login
if (!isPublic && !loggedIn) {
    window.location.href = 'Login And Registration HTML.html';
}
