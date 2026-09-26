const errorMessage = document.getElementById('error_message');
const successMessage = document.getElementById('success_message');
const form = document.getElementById('contactForm');

form.addEventListener('submit', handleSubmit);

function validate() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    errorMessage.style.padding = '10px';
    errorMessage.innerHTML = '';
    successMessage.innerHTML = '';

    if (name.length < 3) {
        errorMessage.innerHTML = 'Please enter a valid name.';
        return false;
    }
    if (isNaN(phone) || phone.length !== 10) {
        errorMessage.innerHTML = 'Please enter a valid 10-digit phone number.';
        return false;
    }
    if (email.indexOf('@') === -1 || email.length < 6) {
        errorMessage.innerHTML = 'Please enter a valid email address.';
        return false;
    }
    if (message.length < 5) {
        errorMessage.innerHTML = 'Please enter a message.';
        return false;
    }

    return true;
}

async function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) {
        return;
    }

    const payload = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        message: document.getElementById('message').value.trim()
    };

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Unable to send message.');
        }

        successMessage.style.padding = '10px';
        successMessage.style.color = 'green';
        successMessage.innerHTML = 'Message sent successfully. Redirecting...';

        setTimeout(() => {
            window.location.href = 'Contact Form Confirm HTML and CSS.html';
        }, 1200);
    } catch (err) {
        errorMessage.innerHTML = 'Error sending message: ' + err.message;
    }
}