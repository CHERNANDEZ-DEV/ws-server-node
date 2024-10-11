const express = require('express');
const mqtt = require('mqtt');
const WebSocket = require('ws');

const app = express();
const port = 3000;

// Configuración del cliente MQTT
const mqttClient = mqtt.connect('mqtt://142.93.14.140'); // Reemplaza con la dirección de tu servidor Mosquitto

const topics = ['sensors/temperature', 'sensors/humidity', 'sensors/distance', 'sensors/flame', 'sensors/soilMoisture'];

mqttClient.on('connect', () => {
    console.log('Conectado al servidor MQTT');
    mqttClient.subscribe(topics, (err) => {
        if (!err) {
            console.log(`Suscrito a los tópicos: ${topics.join(', ')}`);
        } else {
            console.error('Error al suscribirse:', err);
        }
    });
});

mqttClient.on('message', (topic, message) => {
    console.log(`Mensaje recibido en ${topic}: ${message.toString()}`);
    // Transmitir el mensaje a todos los clientes WebSocket
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ topic, message: message.toString() }));
        }
    });
});

// Crear un servidor WebSocket
const server = app.listen(port, () => {
    console.log(`API escuchando en http://localhost:${port}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Cliente WebSocket conectado');
    ws.on('message', (message) => {
        console.log('Mensaje recibido del cliente:', message);
    });

    ws.on('close', () => {
        console.log('Cliente WebSocket desconectado');
    });
});

// Endpoint de ejemplo
app.get('/', (req, res) => {
    res.send('API MQTT está funcionando');
});

