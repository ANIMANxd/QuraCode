let qr = null;
        
        function switchTab(tab) {
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(t => t.classList.remove('active'));
            event.target.classList.add('active');

            document.getElementById('basicControls').style.display = tab === 'basic' ? 'block' : 'none';
            document.getElementById('advancedControls').style.display = tab === 'advanced' ? 'block' : 'none';
        }

        function showToast(message) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.style.display = 'block';
            setTimeout(() => {
                toast.style.display = 'none';
            }, 3000);
        }

        function generateQR() {
            const text = document.getElementById('qr-text').value;
            if (!text) {
                showToast('Please enter some text or URL');
                return;
            }

            const size = parseInt(document.getElementById('qr-size').value);
            const colorDark = document.getElementById('qr-color-dark').value;
            const colorLight = document.getElementById('qr-color-light').value;
            const correctLevel = document.getElementById('qr-correction').value;

            const qrContainer = document.getElementById('qrcode');
            qrContainer.innerHTML = '';

            qr = new QRCode(qrContainer, {
                text: text,
                width: size,
                height: size,
                colorDark: colorDark,
                colorLight: colorLight,
                correctLevel: QRCode.CorrectLevel[correctLevel]
            });

            const watermark = document.getElementById('watermark').value;
            if (watermark) {
                setTimeout(() => {
                    const canvas = document.createElement('canvas');
                    const img = qrContainer.querySelector('img');
                    canvas.width = size;
                    canvas.height = size;
                    const ctx = canvas.getContext('2d');
                    
                    ctx.drawImage(img, 0, 0);
                    
                    const watermarkColor = document.getElementById('watermark-color').value;
                    const watermarkSize = document.getElementById('watermark-size').value;
                    let fontSize;
                    switch(watermarkSize) {
                        case 'small': fontSize = size * 0.06; break;
                        case 'medium': fontSize = size * 0.08; break;
                        case 'large': fontSize = size * 0.1; break;
                    }
                    
                    ctx.font = `${fontSize}px Arial`;
                    ctx.fillStyle = watermarkColor;
                    ctx.textAlign = 'center';
                    ctx.fillText(watermark, size/2, size - fontSize);
                    
                    img.src = canvas.toDataURL();
                }, 50);
            }
        }

        function downloadQR() {
            const img = document.querySelector('#qrcode img');
            if (!img) {
                showToast('Generate a QR code first');
                return;
            }

            const link = document.createElement('a');
            link.download = 'qrcode.png';
            link.href = img.src;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast('QR code downloaded!');
        }

        async function copyQR() {
            const img = document.querySelector('#qrcode img');
            if (!img) {
                showToast('Generate a QR code first');
                return;
            }

            try {
                const blob = await fetch(img.src).then(r => r.blob());
                await navigator.clipboard.write([
                    new ClipboardItem({
                        'image/png': blob
                    })
                ]);
                showToast('QR code copied to clipboard!');
            } catch (err) {
                showToast('Failed to copy QR code');
            }
        }

        document.getElementById('qr-text').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                generateQR();
            }
        });