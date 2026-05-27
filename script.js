// Dynamic Google AI Engine Access Point
const API_KEY = 'AIzaSyCwX8V2wwT5pMGWUGGqiVqkR7S_oDkysdk'; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Alakh Sir Core Prompt Instructions
const ALAKH_SIR_RULES = "You are not a robot. You are a high-energy, incredibly passionate, and empathetic Indian teacher inspired by the legendary Alakh Pandey (Physics Wallah) style. Your goal is to teach Commerce, Economics, and IT. Follow these strict rules: 1. Speak in a natural mix of Hindi and English (Hinglish)—just like a friendly elder brother or coach would talk to a student in Mumbai. 2. Use high-energy catchphrases like: 'Suno bhai!', 'Concept ko feel karo!', 'Ratta mat maaro', and 'Dhyan se suniye!' 3. To explain tough concepts, ALWAYS use relatable local examples (e.g., how a local Vada Pav stall manages profits, how shopkeepers in retail markets track inventory, or how local business firms operate). 4. Break down complex topics into super simple, step-by-step logic. Never write boring textbooks paragraphs. Use bullet points and exclamation marks to keep the energy high! 5. End your explanations by checking in on their energy (e.g., 'Samajh aaya kya?' or 'Clear hua?').";

const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.querySelector('.action-send-btn');

function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('msg', `${sender}-msg`, 'bounce-in');
    
    let formattedText = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\"/g, '<strong>$1</strong>');
    messageDiv.innerHTML = sender === 'user' ? `<p><strong>You:</strong> ${formattedText}</p>` : `<p>${formattedText}</p>`;
    
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; 
}

async function askAlakhSir(userMessage) {
    // Injecting loading placeholder animation state smoothly
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('msg', 'ai-msg', 'bounce-in');
    loadingDiv.innerHTML = `<p>EduAI Master is thinking...</p>`;
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Compiling both rule parameters and prompt string safely
    const structuredPrompt = `${ALAKH_SIR_RULES}\n\nUser Question: ${userMessage}`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{ 
                    role: "user",
                    parts: [{ text: structuredPrompt }] 
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP Error Status: ${response.status}`);
        }

        const data = await response.json();
        loadingDiv.remove();

        // Extracting data safely from nested layer response parameters
        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
            const reply = data.candidates[0].content.parts[0].text;
            appendMessage(reply, 'ai');
        } else {
            throw new Error("Invalid response structural format");
        }
    } catch (error) {
        if (loadingDiv) loadingDiv.remove();
        appendMessage("Suno bhai! Connection engine pass ho chuka hai par data pipeline refresh mang raha hai. Ek aur baar hit karo! 🛠️", 'ai');
        console.error("CORS/Fetch Log Context:", error);
    }
}

function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    userInput.value = '';
    askAlakhSir(text);
}

// Global scope execution verification
if (sendBtn && userInput) {
    sendBtn.onclick = handleSend;
    userInput.onkeypress = function(e) {
        if (e.key === 'Enter') handleSend();
    };
}
