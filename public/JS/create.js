document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('certificateForm');
    const namesField = document.getElementById('names');
    const dateField = document.getElementById('date');
    const certificateTemplate = document.getElementById('certificateTemplate');
    const nameText = document.getElementById('nameText');
    const dateText = document.getElementById('dateText');
    const certIDText = document.getElementById('certID');
    const downloadContainer = document.getElementById('downloadContainer');

    let certificates = [];
    let currentIndex = 0;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const names = namesField.value.split(',').map(name => name.trim());
        const date = new Date(dateField.value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

        certificates = names.map(name => ({
            name,
            date,
            certID: generateRandomCertID('GDSC')
        }));

        currentIndex = 0;
        displayCertificate(certificates[currentIndex]);
        generateDownloadLinks(certificates);

        try {
            const response = await saveCertificates(certificates);
            if (response.success) {
                alert('Certificates saved successfully');
            } else {
                alert('Error saving certificates: ' + response.message);
            }
        } catch (error) {
            alert('Error saving certificates: ' + error.message);
        }
    });

    function generateRandomCertID(prefix) {
        let text = prefix + "-";
        const possible = "0123456789ABCDEFGHIJKLM0123456789NOPQRSTUVWXYZ0123456789";

        for (let i = 0; i < 10; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    function displayCertificate(certificate) {
        nameText.textContent = certificate.name;
        dateText.textContent = certificate.date;
        certIDText.textContent = `Certificate ID: ${certificate.certID}`;
    }

    function svgToPng(svgElement, callback) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const svgSize = svgElement.getBoundingClientRect();
        canvas.width = svgSize.width;
        canvas.height = svgSize.height;
        const ctx = canvas.getContext('2d');
        const img = document.createElement('img');
        img.setAttribute('src', 'data:image/svg+xml;base64,' + btoa(svgData));
        
        img.onload = function() {
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL('image/png');
            callback(pngFile);
        };
    }

    async function saveCertificates(certificates) {
        const response = await fetch('/save-certificates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ certificates })
        });

        return response.json();
    }

    async function generateDownloadLinks(certificates) {
        downloadContainer.innerHTML = '';  // Clear previous links

        for (let i = 0; i < certificates.length; i++) {
            displayCertificate(certificates[i]);
            // svgToPng(document.getElementById('certificateTemplate'), (pngFile) => {
            //     const link = document.createElement('a');
            //     link.href = pngFile;
            //     link.download = `${certificates[i].name}-certificate.png`;
            //     link.textContent = `Download ${certificates[i].name}'s Certificate`;
            //     link.style.display = 'block';
            //     link.style.marginTop = '10px';

            //     downloadContainer.appendChild(link);
            // });

            const linkvalue = `${window.location.origin}/c/${certificates[i].certID}`;
            const link = document.createElement('a');
            link.href = linkvalue;
            link.textContent = `Download ${certificates[i].name}'s Certificate`;
            downloadContainer.appendChild(link);
        }
    }
});
