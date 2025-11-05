// Replace this with the ngrok URL printed by your Colab notebook, WITHOUT trailing slash
// e.g. const BACKEND = "https://abcd-12-34-56-78.ngrok.io";

// Set backend to your Django API (no trailing slash here, we'll append /predict/)
const BACKEND = "http://127.0.0.1:8000/api"; // or "http://localhost:8000/api"


document.getElementById('backendUrl').innerText = BACKEND || 'SET_NGROK_URL';

document.getElementById('sendBtn').addEventListener('click', sendMessage);
document.getElementById('clearBtn').addEventListener('click', () => {
  document.getElementById('userInput').value = '';
  document.getElementById('output').innerText = '(no response yet)';
});

async function sendMessage() {
  const message = document.getElementById('userInput').value || '';
  if (!BACKEND || BACKEND === 'SET_NGROK_URL') {
    alert('Please replace SET_NGROK_URL in script.js with your Colab ngrok URL.');
    return;
  }

  try {
    const res = await fetch(BACKEND + '/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error('Network response not OK: ' + res.status + ' - ' + text);
    }

    const data = await res.json();
    document.getElementById('output').innerText = JSON.stringify(data, null, 2);
  } catch (err) {
    document.getElementById('output').innerText = 'Error: ' + err.message;
    console.error(err);
  }
}

async function sendMessage() {
  const message = document.getElementById("userInput").value;
  if (!message) {
    alert('Type a message first');
    return;
  }

  try {
    const res = await fetch(BACKEND + '/predict/', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error('Server error: ' + res.status + ' ' + txt);
    }

    const data = await res.json();
    document.getElementById("output").innerText = JSON.stringify(data, null, 2);
  } catch (err) {
    document.getElementById("output").innerText = 'Error: ' + err.message;
    console.error(err);
  }
}

