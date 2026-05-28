const API_KEY = 'AIzaSyCwX8V2wwT5pMGWUGGqiVqkR7S_oDkysdk';

// Persona Rules
const ALAKH_SIR_RULES = "You are a high-energy Indian teacher like Alakh Pandey. Teach Commerce/Economics in Hinglish with local Mumbai examples. Use bullet points and end with 'Samajh aaya kya?'.";

const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${sender}-msg bounce-in`;
    msgDiv.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function askAI(message) {
    // Typing indicator
    const loading = document.createElement('div');
    loading.className = 'msg ai-msg';
    loading.innerHTML = '<p>Master is thinking...</p>';
    chatBox.appendChild(loading);

    try {
        // Using the global GoogleGenAI from the script tag
        const genAI = new window.GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(ALAKH_SIR_RULES + "\n\nUser: " + message);
        const response = await result.response;
        
        loading.remove();
        appendMessage(response.text(), 'ai');
    } catch (err) {
        loading.remove();
        appendMessage("Bhai, server thoda load le raha hai. Ek baar refresh karke dobara try kar! 🛠️", 'ai');
        console.error(err);
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
userInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') handleSend(); });
