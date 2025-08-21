// function addMessage(text, sender) {
//     const chatArea = document.getElementById("chatArea");
//     const msg = document.createElement("div");
//     msg.classList.add("message", sender);
//     msg.innerText = text;
//     chatArea.appendChild(msg);
//     chatArea.scrollTop = chatArea.scrollHeight; // auto-scroll
// }

// document.addEventListener("DOMContentLoaded", () => {
//     addMessage("Hi, I am your helpful assistant ", "bot");

//     const askBtn = document.getElementById("askBtn");
//     askBtn.addEventListener("click", async () => {
//         const queryInput = document.getElementById("queryInput");
//         const query = queryInput.value.trim();

//         if (!query) return;

//         // Show user message
//         addMessage(query, "user");
//         queryInput.value = "";

//         // Get videoId from storage
//         chrome.storage.local.get("currentVideoId", async (data) => {
//             const videoId = data.currentVideoId || null;

//             try {
//                 const res = await fetch("http://127.0.0.1:8000/ask", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ videoId, query })
//                 });

//                 const json = await res.json();
//                 const botReply = json.reply || "No reply from server 🤔";

            
//                 addMessage(botReply, "bot");
//             } catch (err) {
//                 addMessage("⚠️ Error connecting to server", "bot");
//                 console.error(err);
//             }
//         });
//     });
// });
function addMessage(text, sender) {
    const chatArea = document.getElementById("chatArea");
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.innerText = text;
    chatArea.appendChild(msg);
    chatArea.scrollTop = chatArea.scrollHeight; // auto-scroll
    return msg; // return reference (useful for editing later)
}

document.addEventListener("DOMContentLoaded", () => {
    addMessage("Hi, I am your helpful assistant 👋", "bot");

    const askBtn = document.getElementById("askBtn");
    askBtn.addEventListener("click", async () => {
        const queryInput = document.getElementById("queryInput");
        const query = queryInput.value.trim();

        if (!query) return;

        // Show user message
        addMessage(query, "user");
        queryInput.value = "";

        // Show bot "Thinking..." placeholder
        const thinkingMsg = addMessage("Thinking", "bot");

        // Animate dots
        let dots = 0;
        const thinkingInterval = setInterval(() => {
            dots = (dots + 1) % 4; // cycle 0-3
            thinkingMsg.innerText = "Thinking" + ".".repeat(dots);
        }, 500);

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

                clearInterval(thinkingInterval); // stop animation
                thinkingMsg.innerText = botReply; // replace with real answer
            } catch (err) {
                clearInterval(thinkingInterval);
                thinkingMsg.innerText = "⚠️ Error connecting to server";
                console.error(err);
            }
        });
    });
});

