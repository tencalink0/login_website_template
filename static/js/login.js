document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        };

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Login Success');
            } else {
                alert('Login Failed');
            }
        })
        .catch(error => {
            console.log('Error: ', error);
        });
    });

    document.getElementById('reset-password').addEventListener('click', () => {
        alert('Reset password is not implemented yet.');
    });
});