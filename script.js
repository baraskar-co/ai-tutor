import { GoogleGenAI } from "@google/generative-ai";

// Secure Access Point Configuration
const API_KEY = 'AIzaSyCwX8V2wwT5pMGWUGGqiVqkR7S_oDkysdk'; 
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Alakh Sir Core Persona Rules
const ALAKH_SIR_RULES = "You are not a robot. You are a high-energy, incredibly passionate, and empathetic Indian teacher inspired by the legendary Alakh Pandey (Physics Wallah) style. Your goal is to teach Commerce, Economics, and IT. Follow these strict rules: 1. Speak in a natural mix of Hindi and English (Hinglish)—just like a friendly elder brother or coach would talk to a student in Mumbai. 2. Use high-energy catchphrases like: 'Suno bhai!', 'Concept ko feel karo!', 'Ratta mat maaro', and 'Dhyan se suniye!' 3. To explain tough concepts, ALWAYS use relatable local examples (e.g., how a local Vada Pav stall manages profits, how shopkeepers in retail markets track inventory, or how local business firms operate). 4. Break down complex topics into super simple, step-by-step logic. Never write boring textbooks paragraphs. Use bullet points and exclamation marks to keep the energy high! 5. End your explanations by checking in on their energy (e.g., 'Samajh aaya kya?' or 'Clear hua?').";

const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.querySelector('.action-send-btn');

function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('msg', `${sender}-msg`, 'bounce-in');
    
    let formattedText = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    messageDiv.innerHTML = sender === 'user' ? `<p><strong>You:</strong> ${formattedText}</p>` : `<p>${formattedText}</p>`;
    
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; 
}

async function askAlakhSir(userMessage) {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('msg', 'ai-msg', 'bounce-in');
    loadingDiv.innerHTML = `<p>EduAI Master is thinking...</p>`;
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // Direct secure model call via Google SDK
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: `${ALAKH_SIR_RULES}\n\nUser Question: ${userMessage}`,
        });

        loadingDiv.remove();

        if (response && response.text) {
            appendMessage(response.text, 'ai');
        } else {
            throw new Error("Empty response object");
        }
    } catch (error) {
        if (loadingDiv) loadingDiv.remove();
        appendMessage("Suno bhai! Connection clear ho chuka hai par page fresh cache maang raha hai. Ek baar Hard Refresh (Ctrl + F5) maaro! 🛠️", 'ai');
        console.error("SDK Execution Log:", error);
    }
}

function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    userInput.value = '';
    askAlakhSir(text);
}

if (sendBtn && userInput) {
    sendBtn.onclick = handleSend;
    userInput.onkeypress = function(e) {
        if (e.key === 'Enter') handleSend();
    };
}
