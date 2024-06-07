document.addEventListener('DOMContentLoaded', () => {
    const validateButton = document.getElementById('validateButton');

    validateButton.addEventListener('click', async () => {
        const certificateId = document.getElementById('certificateId').value;

        try {
            // Send a POST request to the server to validate the certificate
            const response = await fetch('/validate-certificate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ certID: certificateId })
            });

            // Parse the JSON response
            const data = await response.json();

            // Display the validation result
            if (data.valid) {
                alert('Certificate is valid!');
            } else {
                alert('Certificate is not valid.');
            }
        } catch (error) {
            console.error('Error validating certificate:', error);
            alert('An error occurred while validating the certificate.');
        }
    });
});
