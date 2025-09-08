// Auto scroll to bottom
function scrollToBottom() {
  const chat = document.getElementById("chatContainer");
  chat.scrollTop = chat.scrollHeight;
}

window.onload = scrollToBottom;

// console.log("ChatBot script loaded");
const sendButton = document.getElementById("sendButton");
const messageInput = document.getElementById("messageInput");
const chatContainer = document.getElementById("chatContainer");
sendButton.addEventListener("click", massageSend);
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    massageSend();
  }
});
async function massageSend() {
  const message = messageInput.value.trim();
  if (message === "") return;
  const userMessageDiv = document.createElement("div");
  userMessageDiv.className =
    "my-6 bg-green-900  p-4 rounded-lg ml-auto max-w-full w-fit";
  userMessageDiv.textContent = message;
  chatContainer.appendChild(userMessageDiv);
  scrollToBottom();
  messageInput.value = "";

  // console.log(message);
  const assistantReply = await sendToLLM(message);
  // console.log("Assistant:", assistantReply);

  // Add assistant message
  const assistantMessageDiv = document.createElement("div");
  assistantMessageDiv.className =
    "my-6 bg-blue-900 p-4 rounded-lg mr-auto max-w-full  w-fit text-white";
  assistantMessageDiv.textContent = assistantReply;
  chatContainer.appendChild(assistantMessageDiv);
  scrollToBottom();
}

async function sendToLLM(message) {
  const response = await fetch("http://localhost:3123/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // capitalized C works better cross-platform
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error("Error generating response!!!");
  }

  const data = await response.json();
  return data.response; // { response: "LLM reply..." }
}
