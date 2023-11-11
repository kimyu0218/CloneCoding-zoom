const socket = io();

const welcome = document.getElementById("welcome");
const roomNoForm = welcome.querySelector("form");
const chat = document.getElementById("chat");
chat.hidden = true;

let roomName;

function showRoom() {
  welcome.hidden = true;
  chat.hidden = false;
  const h3 = chat.querySelector("h3");
  h3.innerText = `Room ${roomName}`;

  const chatForm = chat.querySelector("#msg");
  const nickForm = chat.querySelector("#nick");
  chatForm.addEventListener("submit", handleMessageSubmit);
  nickForm.addEventListener("submit", handleNicknameSubmit);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = chat.querySelector("#msg input");
  const value = input.value;
  socket.emit("chat", value, roomName, () => {
    addMessage(`[You]: ${value}`);
  });
  input.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = chat.querySelector("#nick input");
  const value = input.value;
  socket.emit("nick", value);
  input.value = "";
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = roomNoForm.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

function addMessage(msg) {
  const ul = chat.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = msg;
  ul.appendChild(li);
}

roomNoForm.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, newCnt) => {
  const h3 = chat.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCnt})`;
  addMessage(`user #${user} joined ,,,`);
});

socket.on("bye", (user, newCnt) => {
  const h3 = chat.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCnt})`;
  addMessage(`user #${user} left ,,,`);
});

socket.on("chat", addMessage);

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
