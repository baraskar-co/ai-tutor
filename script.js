// Connect your live Gemini Brain securely
const API_KEY = 'AIzaSyCwX8V2wwT5pMGWUGGqiVqkR7S_oDkysdk'; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Alakh Sir Persona Injection Context
const ALAKH_SIR_RULES = "You are not a robot. You are a high-energy, incredibly passionate, and empathetic Indian teacher inspired by the legendary Alakh Pandey (Physics Wallah) style. Your goal is to teach Commerce, Economics, and IT. Follow these strict rules: 1. Speak in a natural mix of Hindi and English (Hinglish)—just like a friendly elder brother or coach would talk to a student in Mumbai. 2. Use high-energy catchphrases like: 'Suno bhai!', 'Concept ko feel karo!', 'Ratta mat maaro', and 'Dhyan se suniye!' 3. To explain tough concepts, ALWAYS use relatable local examples (e.g., how a local Vada Pav stall manages profits, how shopkeepers in retail markets track inventory, or how local business firms operate). 4. Break down complex topics into super simple, step-by-step logic. Never write boring textbooks paragraphs. Use bullet points and exclamation marks to keep the energy high! 5. End your explanations by checking in on their energy (e.g., 'Samajh aaya kya?' or 'Clear hua?').";

const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// Function to safely inject chats into layout with dynamic animations
function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('msg', `${sender}-msg`, 'bounce-in');
    
    let formattedText = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\"/g, '<strong>$1</strong>');
    
    messageDiv.innerHTML = sender === 'user' ? `<p><strong>You:</strong> ${formattedText}</p>` : `<p>${formattedText}</p>`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; 
}

// Network Request Processing Layer
async function askAlakhSir(userMessage) {
    // Dynamic loading module state
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('msg', 'ai-msg', 'bounce-in');
    loadingDiv.innerHTML = `<p class="thinking-state">EduAI Master is thinking...</p>`;
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Folding instruction inside core content body payload to resolve connection issues
    const structuredPrompt = `${ALAKH_SIR_RULES}\n\nUser Prompt: ${userMessage}`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: structuredPrompt }] }]
            })
        });

        const data = await response.json();
        loadingDiv.remove();

        if (data.candidates && data.candidates[0].content) {
            const reply = data.candidates[0].content.parts[0].text;
            appendMessage(reply, 'ai');
        } else {
            throw new Error("Payload format error");
        }

    } catch (error) {
        loadingDiv.remove();
        appendMessage("Suno bhai, connection ko ek baar refresh marna padega! Hard reload (Ctrl + F5) karke ek baar dobara type karo! 🛠️", 'ai');
        console.error("Internal Engine Error Details:", error);
    }
}

function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    userInput.value = '';
    askAlakhSir(text);
}

// Execution Bindings
if (sendBtn && userInput) {
    sendBtn.onclick = handleSend;
    userInput.onkeypress = function(e) {
        if (e.key === 'Enter') handleSend();
    };
}
