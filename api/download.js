async function uploadMedal() {
  const medalUrl = document.getElementById('medalUrl').value;
  const response = await fetch('/api/medalwatermark', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url: medalUrl })
  });
  const data = await response.json();
  if (data.valid && data.src) {
    const videoSrc = data.src;
    const videoElement = document.getElementById('medalVideo');
    videoElement.src = videoSrc;
    videoElement.style.display = 'block'; // Show video
  } else {
    alert('Invalid Medal video URL!');
  }
}
