import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { LOCAL_STORAGE_TV_ID } from './constants';

/**
 * Message format
 */
type Message = {
  type: 'command' | 'info';
  value: string | number;
  tvID?: string;
};

const MOBILE_CONNECTOR_SERVER_URL = 'http://172.16.12.73:2424';
let socket: Socket | undefined = undefined;

const Sockets = (): JSX.Element => {
  const navigation = useNavigate();
  const [uuid, setUUID] = useState<string | undefined | null>(undefined);

  useEffect(() => {
    setUUID(localStorage.getItem(LOCAL_STORAGE_TV_ID));
    if (uuid) {
      setUUID(uuid);
      socket = io(MOBILE_CONNECTOR_SERVER_URL);

      socket.on('connect', () => {
        console.log('!!! socket connected');
      });

      socket.on('connect_error', (error) => {
        console.error('connection error');
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [uuid]);

  const sendCommand = (command: 'PLAY' | 'PAUSE' | 'RETURN'): void => {
    const tvID = localStorage.getItem(LOCAL_STORAGE_TV_ID);
    if (tvID && socket) {
      const message: Message = {
        tvID,
        type: 'command',
        value: command,
      };
      socket.send(JSON.stringify(message));
    }
  };

  const debugRemoveLocalStorage = (): void => {
    localStorage.removeItem(LOCAL_STORAGE_TV_ID);
    navigation('/gr');
  };

  return (
    <>
      <h1>Feature home of Socket.IO client</h1>

      {uuid && (
        <>
          <div>
            <Button
              variant='contained'
              size='large'
              onClick={() => {
                sendCommand('PLAY');
              }}
            >
              Send PLAY command
            </Button>
          </div>

          <div style={{ marginTop: '25px' }}>
            <Button
              variant='contained'
              size='large'
              onClick={() => {
                sendCommand('PAUSE');
              }}
            >
              Send PAUSE command
            </Button>
          </div>

          <div style={{ marginTop: '25px' }}>
            <Button
              variant='contained'
              size='large'
              onClick={() => {
                sendCommand('RETURN');
              }}
            >
              Send RETURN command
            </Button>
          </div>
        </>
      )}

      {!uuid && (
        <div style={{ marginTop: '25px' }}>
          <Link to='/qr'>Check QR</Link>
        </div>
      )}

      <div style={{ marginTop: '25px' }}>
        <Button
          variant='contained'
          color='error'
          size='large'
          onClick={debugRemoveLocalStorage}
        >
          Remove local storage TV ID
        </Button>
      </div>
    </>
  );
};

export default Sockets;
