// Function to handle the microphone input and blow detection
async function init() {
    const candleLoop = document.getElementById('candle-loop'); // First video (looping candle)
    const candleBlow = document.getElementById('candle-blow'); // Second video (blowout)
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
                // Stop the looping video and show the blowout video
                candleLoop.classList.add('hidden');
                candleBlow.classList.remove('hidden');
                candleBlow.play();

                // After the blowout video ends, show the Happy Birthday message
                candleBlow.onended = () => {
                    candleBlow.classList.add('hidden'); // Hide the blowout video
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
