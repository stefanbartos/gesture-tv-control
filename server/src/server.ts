import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import http from 'http';
import { Server, Socket } from 'socket.io';

const PORT = 2424;

const clientSockets: Socket[] = [];

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: '*',
  }
});

io.on('connection', (socket: Socket) => {
  const { headers } = socket.request;
  const uuid = headers['uuid'].toString() || uuidv4();
  clientSockets[uuid] = socket;

  socket.send(`Welcome UUID: ${uuid}`);

  socket.on('message', (data) => {
    // Decoding the message
    const message = JSON.parse(data);

    // Get client tvID from message
    const tvID = message.tvID;

    // Get type from message
    const messageType = message.type;

    // Get value from message
    const value = message.value;

    if (messageType && messageType === 'command') {
      // Find client socket according to tvID
      const tvSocket = clientSockets[tvID];

      const message = {
        type: messageType,
        value,
      };

      tvSocket.send(JSON.stringify(message));
    }
  });
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
