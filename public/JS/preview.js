document.addEventListener('DOMContentLoaded', function () {
    const previewDiv = document.getElementById('previewDiv');

    // Function to fetch certificates from the server
    async function fetchCertificates() {
        try {
            const response = await fetch('/certificates');
            const certificates = await response.json();

            // Clear the previewDiv
            previewDiv.innerHTML = '';

            // Populate the previewDiv with certificates
            certificates.forEach(cert => {
                const certElement = document.createElement('div');
                certElement.id = 'previewElement';

                const nameText = document.createElement('div');
                nameText.id = 'nametext';
                nameText.innerHTML = `<p>${cert.name}</p>`;
                certElement.appendChild(nameText);

                const linkButton = document.createElement('button');
                linkButton.innerHTML = '<i class="fa-solid fa-link"></i>';
                certElement.appendChild(linkButton);

                const deleteButton = document.createElement('button');
                deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
                deleteButton.addEventListener('click', () => deleteCertificate(cert._id));
                certElement.appendChild(deleteButton);

                previewDiv.appendChild(certElement);
            });
        } catch (error) {
            console.error('Error fetching certificates:', error);
        }
    }

    // Function to delete a certificate
    async function deleteCertificate(certId) {
        try {
            const response = await fetch(`/certificates/${certId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Remove the certificate element from the DOM
                fetchCertificates();
            } else {
                console.error('Error deleting certificate');
            }
        } catch (error) {
            console.error('Error deleting certificate:', error);
        }
    }

    // Fetch certificates on page load
    fetchCertificates();
});
