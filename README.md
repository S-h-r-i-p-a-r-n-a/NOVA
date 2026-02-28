# 🚀 NOVA AI Assistant

A modern, responsive web-based AI chatbot powered by Google Gemini AI. NOVA delivers natural conversations with a sleek, professional UI designed for both desktop and mobile users.

## 📸 Preview
<img width="1919" height="1096" alt="Screenshot 2026-02-28 225959" src="https://github.com/user-attachments/assets/391b0b43-bcfd-4ee3-b9db-050fef568ec5" />

- Clean landing page
- Floating chatbot button
- Smooth open/close animation
- Styled chat bubbles for user & bot
- Typing indicator ("Thinking…")

## ✨ Features

- 🤖 **AI Powered** – Uses Google Gemini API for intelligent responses
- 💬 **Interactive Chat UI** – User and bot messages styled separately
- 🖋 **Typing Indicator** – Shows "Thinking…" before replies
- 📱 **Fully Responsive** – Works on mobile, tablet, and desktop
- 🧠 **Natural Conversations** – Friendly assistant personality (NOVA)
- 📝 **Auto-Resizing Input** – Textarea grows as you type
- 🔄 **Smooth Animations** – Chat toggle & transitions
- 🔐 **Secure API Key Handling** – Environment variables via `.env`

## 🛠 Tech Stack

**Frontend**
- HTML5
- CSS3
- Vanilla JavaScript
- Google Material Symbols

**Backend**
- Node.js
- Express.js

**AI**
- Google Gemini (`@google/generative-ai`)

**Utilities**
- dotenv
- CORS

## 📂 Project Structure

```
NOVA/
│── .git/
│── node_modules/
│── .env
│── .gitignore
│── index.html
│── script.js
│── style.css
│── server.js
│── package.json
│── package-lock.json
│── README.md
```

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/nova-chatbot.git
cd nova-chatbot
```

### 2️⃣ Install Dependencies

Make sure Node.js (v18+) is installed.

```bash
npm install
```

### 3️⃣ Set Up Environment Variables

Create a `.env` file in the project root:

```
PORT=3000
GEMINI_API_KEY=your_google_gemini_api_key
```

> ⚠️ Do not add quotes around the API key

### 4️⃣ Start the Server

```bash
node server.js
```

You should see:

```
✅ Server running at http://localhost:3000
🔑 Gemini API Key loaded: YES
```

### 5️⃣ Open in Browser

```
http://localhost:3000
```

## 💬 How It Works

1. User sends a message from the chat UI
2. Frontend (`script.js`) sends the message to `/api/chat`
3. Backend (`server.js`) forwards the prompt to Gemini
4. Gemini generates a response
5. Response is cleaned, formatted, and sent back
6. UI updates with styled chat bubble

## 🔐 Security Notes

- API key is stored in `.env`
- `.env` is excluded via `.gitignore`
- API key is never exposed to the frontend

## 🧪 Example API Request

```js
fetch("http://localhost:3000/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "Hello NOVA" })
})
.then(res => res.json())
.then(console.log);
```

## 📌 Future Improvements

- 🔄 Chat memory (conversation context)
- ✍️ Streaming responses (typing effect)
- 🎨 Markdown / rich-text rendering
- 🌍 Deployment (Render / Railway / Vercel)
- 👤 User authentication
- 🌙 Dark mode

## 📄 License

This project is licensed under the MIT License. You are free to use, modify, and distribute it.

## 🙌 Acknowledgements

- [Google Gemini AI](https://ai.google.dev/)
- [Express.js](https://expressjs.com/)
- Open-source community

## ⭐ Support

If you like this project:

- ⭐ Star the repo
- 🍴 Fork it
- 🧠 Improve it
