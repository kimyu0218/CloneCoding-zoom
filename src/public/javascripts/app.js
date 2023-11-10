const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");

const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("Connected to Server");
});

socket.addEventListener("message", (message) => makeChatLi(message.data));

socket.addEventListener("close", () => {
  console.log("Disconnected from Server");
});

function makeMessage(type, payload) {
  const message = { type, payload };
  return JSON.stringify(message);
}

function makeChatLi(content) {
  const li = document.createElement("li");
  li.innerText = content;
  messageList.append(li);
}

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("chat", input.value));
  makeChatLi(`[You]: ${input.value}`);
  input.value = "";
}

function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nick", input.value));
  input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);

nickForm.addEventListener("submit", handleNickSubmit);
