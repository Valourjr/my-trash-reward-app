document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contact-form');
  
    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
  
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
  
        const data = { name, email, message };
  
        fetch('https://my-trash-reward-app.onrender.com/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(response => {
          if (response.ok) {
            alert('Message sent successfully!');
            form.reset();
          } else {
            alert('Failed to send message.');
          }
        })
        .catch(error => {
          alert('Error sending message.');
          console.error('Error:', error);
        });
      });
    }
  });