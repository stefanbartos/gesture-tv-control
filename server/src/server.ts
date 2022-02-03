import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import http from 'http';
import { Server, Socket } from 'socket.io';

/**
 * Message format
 */
type Message = {
  type: 'command' | 'info';
  value: string | number;
  tvID?: string;
}

const PORT = 2424;

const clientSockets: Socket[] = [];

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  transports: ['polling', 'websocket'],
  cors: {
    origin: '*',
    methods: '*',
  }
});

const sendMessage = (socket: Socket, message: Message): void => {
  socket.send(JSON.stringify(message));
}

io.on('connection', (socket: Socket) => {
  const { headers } = socket.request;
  console.log(headers);

  const uuid = headers['uuid'] ? headers['uuid'].toString() : uuidv4();
  clientSockets[uuid] = socket;

  console.log('New client connected', uuid);
  sendMessage(socket, {
    type: 'info',
    value: `Welcome: ${uuid}`,
  });

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

      const message: Message = {
        type: messageType,
        value,
      };

      sendMessage(tvSocket, message);
    }
  });
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
