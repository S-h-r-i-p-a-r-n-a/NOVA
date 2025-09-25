const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotClosebtn = document.querySelector(".close-btn");

let userMessage;
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing"
        ? `<p></p>`
        : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
};

const generateResponse = (incomingChatLi) => {
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: userMessage
        })
    };

    fetch('http://localhost:3000/api/chat', requestOptions)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            if (data.reply) {
                messageElement.textContent = data.reply;
            } else if (data.error) {
                messageElement.textContent = `⚠️ Error: ${data.error}`;
                console.error('Server error:', data.error, data.details);
            } else {
                messageElement.textContent = "⚠️ No response from model.";
            }
        })
        .catch((error) => {
            messageElement.classList.add("error");
            messageElement.textContent = `❌ Error: ${error.message}`;
            console.error("Fetch error:", error);
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Clear input and reset height
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append user message
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // Add bot "Thinking..." message
    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
};

// Button & UI Toggles
sendChatBtn.addEventListener("click", handleChat);

chatbotClosebtn.addEventListener("click", () =>
    document.body.classList.remove("show-chatbot")
);

chatbotToggler.addEventListener("click", () =>
    document.body.classList.toggle("show-chatbot")
);

// Auto-resize textarea
chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

// Submit on Enter (only if not Shift+Enter)
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});
