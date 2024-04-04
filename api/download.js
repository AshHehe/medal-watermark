// Function to upload Medal URL and fetch video preview
async function uploadMedal() {
  // Get the Medal URL from the input field
  const medalUrl = document.getElementById('medalUrl').value;
  
  try {
    // Make a POST request to the endpoint
    const response = await fetch('https://medal-watermark.vercel.app/api/medalwatermark', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: medalUrl })
    });

    // Parse the JSON response
    const data = await response.json();
    
    // Check if the response is valid and contains a video source
    if (data.valid && data.src) {
      // Display the video preview
      const videoSrc = data.src;
      const videoElement = document.getElementById('medalVideo');
      videoElement.src = videoSrc;
      videoElement.style.display = 'block'; // Show video
    } else {
      // Display an error message if the response is invalid or missing video source
      alert('Invalid Medal video URL!');
    }
  } catch (error) {
    // Display an error message if there's an error with the request
    console.error('Error uploading Medal URL:', error);
    alert('Failed to upload Medal URL. Please try again.');
  }
}
