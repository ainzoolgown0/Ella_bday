// Function to handle the microphone input and blow detection
async function init() {
    const birthdayVideo = document.getElementById('birthday-video');
    const birthdayMessage = document.getElementById('birthday-message');

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const microphone = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        microphone.connect(analyser);
        analyser.fftSize = 512;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        function detectBlow() {
            analyser.getByteFrequencyData(dataArray);
            const maxVolume = Math.max(...dataArray);

            // When blow is detected (adjust threshold as needed)
            if (maxVolume > 150) {
                birthdayVideo.classList.remove('hidden'); // Show the video
                birthdayVideo.play(); // Play the video

                // After the video ends, show the Happy Birthday message
                birthdayVideo.onended = () => {
                    birthdayVideo.classList.add('hidden'); // Hide the video
                    birthdayMessage.classList.remove('hidden'); // Show Happy Birthday message
                };
            }

            requestAnimationFrame(detectBlow);
        }

        detectBlow();

    } catch (err) {
        console.error('Error accessing microphone:', err);
    }
}

window.onload = init;
