const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotClosebtn = document.querySelector(".close-btn");

let userMessage;
const inputInitHeight = chatInput.scrollHeight;

// Create chat message element
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);

    const content =
        className === "outgoing"
            ? `<p></p>`
            : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;

    chatLi.innerHTML = content;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
};

// Call backend and update bot message
const generateResponse = async (incomingChatLi) => {
    const messageElement = incomingChatLi.querySelector("p");

    try {
        const res = await fetch("http://localhost:3000/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: userMessage }),
        });

        if (!res.ok) {
            throw new Error(`HTTP error: ${res.status}`);
        }

        const data = await res.json();

        if (data.reply) {
            messageElement.innerHTML = formatResponse(data.reply);
        } else {
            messageElement.textContent = "⚠️ No response from server.";
        }
    } catch (error) {
        messageElement.classList.add("error");
        messageElement.textContent = "❌ Error getting response.";
        console.error(error);
    } finally {
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
};
function formatResponse(text) {
    // Convert bullet points (* item) to HTML list
    text = text.replace(/\* (.+)/g, "<li>$1</li>");

    // If list exists, wrap in <ul>
    if (text.includes("<li>")) {
        text = "<ul>" + text + "</ul>";
    }

    // Convert new lines to <br>
    text = text.replace(/\n/g, "<br>");

    return text;
}

// Handle sending message
const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // User message
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // Bot placeholder
    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 500);
};

// UI events
sendChatBtn.addEventListener("click", handleChat);

chatbotClosebtn.addEventListener("click", () =>
    document.body.classList.remove("show-chatbot")
);

chatbotToggler.addEventListener("click", () =>
    document.body.classList.toggle("show-chatbot")
);

// Auto resize textarea
chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

// Enter key submit
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleChat();
    }
});