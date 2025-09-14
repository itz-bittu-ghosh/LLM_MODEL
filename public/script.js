function scrollToBottom() {
  const chat = document.getElementById("chatContainer");
  chat.scrollTop = chat.scrollHeight;
}

window.onload = scrollToBottom;

const sendButton = document.getElementById("sendButton");
const messageInput = document.getElementById("messageInput");
const chatContainer = document.getElementById("chatContainer");
sendButton.addEventListener("click", messageSend);

messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    messageSend();
  }
});

async function messageSend() {
  const message = messageInput.value.trim();
  if (message === "") return;
  const userMessageDiv = document.createElement("div");
  userMessageDiv.className =
    "my-6 bg-red-900  p-4 rounded-lg ml-auto max-w-full w-fit";
  userMessageDiv.textContent = message;
  chatContainer.appendChild(userMessageDiv);
  scrollToBottom();
  messageInput.value = "";

  const thinking = document.createElement("div");
  thinking.className =
    "my-6 animate-pulse";
  thinking.textContent = "Thinking...";
  chatContainer.appendChild(thinking);

  const assistantReply = await sendToLLM(message);

  // Add assistant message
  const assistantMessageDiv = document.createElement("div");
  assistantMessageDiv.className =
    "my-6 bg-blue-900 p-4 rounded-lg mr-auto max-w-full  w-fit text-white";
  assistantMessageDiv.textContent = assistantReply;
  thinking.remove();
  chatContainer.appendChild(assistantMessageDiv);

  scrollToBottom();
}

async function sendToLLM(message) {
  const response = await fetch("/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error("Error generating response!!!");
  }

  const data = await response.json();
  return data.response; // { response: "LLM reply..." }
}
