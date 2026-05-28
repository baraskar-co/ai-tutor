const API_KEY = 'AQ.Ab8RN6IOdUSVrXv1LICverscGUwAj6eWJIEEpl1eB9CsQ8b4FA';

// Persona: Alakh Sir High Energy
const ALAKH_SIR_RULES = "You are a high-energy Indian teacher like Alakh Pandey. Teach Commerce, Economics, and IT in Hinglish with local Mumbai examples. Use bullet points and end with 'Samajh aaya kya?'.";

const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${sender}-msg bounce-in`;
    let formattedText = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    msgDiv.innerHTML = `<p>${formattedText}</p>`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function askAI(message) {
    const loading = document.createElement('div');
    loading.className = 'msg ai-msg';
    loading.id = 'temp-loading';
    loading.innerHTML = '<p>Master is thinking...</p>';
    chatBox.appendChild(loading);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // UPDATED: Simple access for the global library
        const genAI = new window.google.generativeAi.GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(ALAKH_SIR_RULES + "\n\nUser: " + message);
        const response = await result.response;
        const text = response.text();
        
        if(document.getElementById('temp-loading')) document.getElementById('temp-loading').remove();
        appendMessage(text, 'ai');
    } catch (err) {
        console.error("DEBUG ERROR:", err);
        if(document.getElementById('temp-loading')) document.getElementById('temp-loading').remove();
        appendMessage("Bhai, server thoda nakhre kar raha hai. Ek baar refresh karke dobara try kar! 🛠️", 'ai');
    }
}

function handleSend() {
    const val = userInput.value.trim();
    if (!val) return;
    appendMessage(`<strong>You:</strong> ${val}`, 'user');
    userInput.value = '';
    askAI(val);
}

sendBtn.onclick = handleSend;
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
