const socket = new WebSocket(`ws://${window.location.host}`);
const message = document.getElementById('message');
const chat = document.getElementById('chat-history');

socket.onopen = (evt) => {
	console.log("evt", evt);
	write('Connection estabilished!');
}

socket.onmessage = (evt) => {
	console.log("evt", evt);
	write(evt.data);
}

socket.onclose = (evt) => {
	console.log("evt", evt);
	write('Error! ' + evt);
}

function write(msg) {
	chat.innerHTML += msg + '<br>';
}

function sendMessage() {
	if(socket.readyState === WebSocket.OPEN) {
		socket.send(message.value);
		message.value = '';
		message.focus();
	}
}