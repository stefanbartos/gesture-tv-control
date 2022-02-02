import { WebSocket, WebSocketServer, RawData } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { IncomingMessage } from 'http';

const clientSockets = {};

const wss = new WebSocketServer({
  port: 2424,
  perMessageDeflate: {
    zlibDeflateOptions: {
      chunkSize: 1024,
      memLevel: 7,
      level: 3,
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024,
    },
    clientNoContextTakeover: true,
    serverNoContextTakeover: true,
    serverMaxWindowBits: 10,
    concurrencyLimit: 10,
    threshold: 1024,
  }
});

const sendMessage = (ws: WebSocket, message: string): void => {
  ws.send(JSON.stringify(message));
};

// CONNECT /?:uuid
wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
  // Client connected
  const uuidFromUrl = req.url.substring(1);
  const userID = uuidFromUrl.length > 0 ? uuidFromUrl : uuidv4();
  // Add new client socket
  clientSockets[userID] = ws;

  // Send welcome message
  sendMessage(ws, `Welcome user ${userID}`);

  // New message was received from the client
  ws.on('message', (data: RawData) => {
    console.log('message from:', userID);
    const messageArray = JSON.parse(data.toString());
    const sendToSocket = clientSockets[messageArray[0]];
    sendMessage(sendToSocket, messageArray[1]);
  });

  // User connection closed
  ws.on('close', () => {
    console.log(`User with ID ${userID} was disconnected`);
    delete clientSockets[userID];
  });
});
