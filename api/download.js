async function uploadMedal() {
    const medalLink = document.getElementById('medal-link').value;
    try {
        const response = await fetch('/api/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: medalLink })
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch. Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Response:', data);
        const videoPreview = document.getElementById('video-preview');
        videoPreview.src = data.src;
        const downloadLink = document.getElementById('download-link');
        downloadLink.href = data.src;
        downloadLink.style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
    }
}
