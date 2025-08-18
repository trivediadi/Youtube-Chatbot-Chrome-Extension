function addMessage(text, sender) {
    const chatArea = document.getElementById("chatArea");
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.innerText = text;
    chatArea.appendChild(msg);
    chatArea.scrollTop = chatArea.scrollHeight; // auto-scroll
}

document.addEventListener("DOMContentLoaded", () => {
    // Show welcome message from chatbot
    addMessage("Hi, I am your helpful assistant 🤖", "bot");

    const askBtn = document.getElementById("askBtn");
    askBtn.addEventListener("click", () => {
        const queryInput = document.getElementById("queryInput");
        const query = queryInput.value.trim();

        if (!query) return;

        // Show user message
        addMessage(query, "user");
        queryInput.value = "";

        // For now, simulate bot reply
        let botReply = "This is a dummy reply!";
        if (query.toLowerCase() === "hi") {
            botReply = "Hello! How can I help you today?";
        }

        // Show bot reply
        addMessage(botReply, "bot");

    });
});

