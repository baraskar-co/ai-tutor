const API_KEY = 'AIzaSyCwX8V2wwT5pMGWUGGqiVqkR7S_oDkysdk'; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const SYSTEM_INSTRUCTION = "You are not a robot. You are a high-energy, incredibly passionate, and empathetic Indian teacher inspired by the legendary Alakh Pandey (Physics Wallah) style. Your goal is to teach Commerce, Economics, and IT. Follow these strict rules: 1. Speak in a natural mix of Hindi and English (Hinglish)—just like a friendly elder brother or coach would talk to a student in Mumbai. 2. Use high-energy catchphrases like: 'Suno bhai!', 'Concept ko feel karo!', 'Ratta mat maaro', and 'Dhyan se suniye!' 3. To explain tough concepts, ALWAYS use relatable local examples (e.g., how a local Vada Pav stall manages profits, how shopkeepers in retail markets track inventory, or how local business firms operate). 4. Break down complex topics into super simple, step-by-step logic. Never write boring textbooks paragraphs. Use bullet points and exclamation marks to keep the energy high! 5. End your explanations by checking in on their energy (e.g., 'Samajh aaya kya?' or 'Clear hua?').";

const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    
    let formattedText = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    messageDiv.innerHTML = sender === 'user' ? `<p><strong>You:</strong> ${formattedText}</p>` : `<p>${formattedText}</p>`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function askAlakhSir(userMessage) {
    appendMessage("EduAI is thinking...", "ai");
    const loadingMessage = chatBox.lastChild;
    const fullPrompt = `${SYSTEM_INSTRUCTION}\n\nUser Question: ${userMessage}`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: fullPrompt }] }]
            })
        });

        if (!response.ok) throw new Error(`API status error`);

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        loadingMessage.remove();
        appendMessage(aiResponse, "ai");

    } catch (error) {
        if (loadingMessage) loadingMessage.remove();
        appendMessage("Suno bhai, lagta hai network mein thoda crash hua hai! Dubara try karo! 🛠️", "ai");
        console.error(error);
    }
}

function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    userInput.value = '';
    askAlakhSir(text);
}

// Secure fallback activation
if (sendBtn && userInput) {
    sendBtn.onclick = handleSend;
    userInput.onkeypress = function(e) {
        if (e.key === 'Enter') handleSend();
    };
}
