// document.addEventListener('DOMContentLoaded', () => {
//     const form = document.getElementById('certificateForm');
//     const namesField = document.getElementById('names');
//     const dateField = document.getElementById('date');
//     const certificateTemplate = document.getElementById('certificateTemplate');
//     const nameText = document.getElementById('nameText');
//     const dateText = document.getElementById('dateText');
//     const certIDText = document.getElementById('certID');
//     const downloadContainer = document.getElementById('downloadContainer');
const name = document.getElementById('name').textContent;
const certid = document.getElementById('certid').textContent;
console.log(name, certid);
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
    
    
    document.getElementById('downloadBtn').addEventListener('click', ()=>{
        svgToPng(document.getElementById('certificateTemplate'), (pngFile) => {
            const link = document.createElement('a');
            link.href = pngFile;
            link.download = `${name}-certificate.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    })
    
            

            
