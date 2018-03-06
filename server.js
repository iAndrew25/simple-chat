const express = require('express');
	http = require('http'),
	url = require('url'),
	WebSocket = require('ws'),
	path = require('path');

const app = express(),
	port = 8080,
	server = http.createServer(app),
	wss = new WebSocket.Server({ server });

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.use(express.static(path.join(__dirname, 'pub')));

wss.on('connection', (ws, req) => {
	noticeAllClients(wss.clients, `New client in town. Currently there are ${wss.clients.size} clients online.`)
	
	ws.on('error', err => {
		if (err.code !== 'ECONNRESET') {
			throw err
		}
	});

	ws.on('close', function close() {
		noticeAllClients(wss.clients, `One client left the town. Currently there are ${wss.clients.size} clients online.`);
	});

	ws.on('message', message => {
		console.log("message", message);
		noticeAllClients(wss.clients, `[${getTimesamp()}] ${message}`);
	});
});

server.listen(port, () => console.log(`Listening on port ${port}`));

function noticeAllClients(clients, message) {
	clients.forEach(client => {
		if(client.readyState === WebSocket.OPEN) {
			client.send(message);
		}
	})
}

const getTimesamp = () => new Date().toTimeString().split(' ')[0];