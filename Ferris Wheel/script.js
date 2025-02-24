document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const passwordField = document.getElementById('new-password');
    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.textContent = 'Show';
    toggleButton.style.marginLeft = '10px';

    passwordField.parentNode.appendChild(toggleButton);

    toggleButton.addEventListener('click', function() {
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            toggleButton.textContent = 'Hide';
        } else {
            passwordField.type = 'password';
            toggleButton.textContent = 'Show';
        }
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        if (!form.checkValidity()) {
            form.classList.add('shake');
            setTimeout(() => form.classList.remove('shake'), 500);
        } else {
            form.classList.add('fade-out');
            setTimeout(() => alert('Form submitted successfully!'), 500);
        }
    });

    const accountRadios = document.querySelectorAll('input[name="account-type"]');
    accountRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            alert(`Selected account type: ${this.nextSibling.textContent.trim()}`);
        });
    });

    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('focus', function() {
            this.classList.add('highlight');
        });
        input.addEventListener('blur', function() {
            this.classList.remove('highlight');
        });
    });
});
