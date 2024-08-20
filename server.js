const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

let connectedClients = 0;

io.on('connection', (socket) => {
    connectedClients++;
    console.log(`Cliente conectado. ID: ${socket.id}. Total de clientes: ${connectedClients}`);
    
    // Enviar o ID de conexão ao cliente
    socket.emit('connection_id', socket.id);
    
    // Emitir a contagem de clientes para todos os clientes conectados
    io.emit('client_count', connectedClients);

    // Evento para receber e repassar a mensagem
    socket.on('message', (message) => {
        io.emit('message', { id: socket.id, text: message });
    });

    socket.on('disconnect', () => {
        connectedClients--;
        console.log(`Cliente desconectado. ID: ${socket.id}. Total de clientes: ${connectedClients}`);
        
        // Atualizar a contagem para todos os clientes conectados
        io.emit('client_count', connectedClients);
    });
});

server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
