const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");

let userMessage;
const inputInitHeight = chatInput.scrollHeight;

/* Create chat message element */
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

/* Format bot response (bullets, line breaks) */
function formatResponse(text) {
    // Convert * bullet points to <li>
    text = text.replace(/\* (.+)/g, "<li>$1</li>");

    // Wrap list items inside <ul>
    if (text.includes("<li>")) {
        text = "<ul>" + text + "</ul>";
    }

    // Convert new lines to <br>
    text = text.replace(/\n/g, "<br>");

    return text;
}

/* Call backend and update bot message */
const generateResponse = async (incomingChatLi) => {
    const messageElement = incomingChatLi.querySelector("p");

    try {
        const res = await fetch("/api/chat", {
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

/* Handle sending message */
const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Reset input
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

/* Send button click */
sendChatBtn.addEventListener("click", handleChat);

/* Auto resize textarea */
chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

/* ✅ ENTER KEY SEND (FIXED) */
chatInput.addEventListener("keydown", (e) => {
    if (e.code === "Enter" && !e.shiftKey) {
        e.preventDefault();        // stop new line
        e.stopPropagation();       // fully block default behavior
        handleChat();              // send message
    }
});