// signaling-server.js

const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });  // 🚩 You are running on port 8080 now

console.log("Signaling server is running on port 8080");

let clients = [];

// Handle incoming connections
server.on('connection', (ws) => {
    console.log('Client connected');
    clients.push(ws);

    ws.on('message', (message) => {
        let data;
        try {
            data = JSON.parse(message);
        } catch (err) {
            console.error('Invalid JSON:', err);
            return;
        }

        console.log('Received:', data.type);

        // Simple broadcast signaling logic
        switch (data.type) {
            case 'offer':
            case 'answer':
            case 'candidate':
                // Send message to all other connected clients (except sender)
                clients.forEach(client => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(data));
                    }
                });
                break;
            default:
                console.log('Unknown message type:', data.type);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        clients = clients.filter(client => client !== ws);
    });
});
