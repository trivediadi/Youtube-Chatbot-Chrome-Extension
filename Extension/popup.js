function addMessage(text, sender) {
    const chatArea = document.getElementById("chatArea");
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.innerText = text;
    chatArea.appendChild(msg);
    chatArea.scrollTop = chatArea.scrollHeight; // auto-scroll
}

document.addEventListener("DOMContentLoaded", () => {
    addMessage("Hi, I am your helpful assistant 🤖", "bot");

    const askBtn = document.getElementById("askBtn");
    askBtn.addEventListener("click", async () => {
        const queryInput = document.getElementById("queryInput");
        const query = queryInput.value.trim();

        if (!query) return;

        // Show user message
        addMessage(query, "user");
        queryInput.value = "";

        // Get videoId from storage
        chrome.storage.local.get("currentVideoId", async (data) => {
            const videoId = data.currentVideoId || null;

            try {
                const res = await fetch("http://127.0.0.1:8000/ask", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ videoId, query })
                });

                const json = await res.json();
                const botReply = json.reply || "No reply from server 🤔";

            
                addMessage(botReply, "bot");
            } catch (err) {
                addMessage("⚠️ Error connecting to server", "bot");
                console.error(err);
            }
        });
    });
});
