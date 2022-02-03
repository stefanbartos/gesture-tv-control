import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { LOCAL_STORAGE_TV_ID } from './constants';

type SocketContext = {
    sendCommand(command: 'PLAY' | 'PAUSE' | 'RETURN');
}

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

const SocketContextInstance = React.createContext<SocketContext>({
    sendCommand: () => { }
});

export const SocketContext = ({ children }) => {
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

    return (
        <SocketContextInstance.Provider value={{ sendCommand: sendCommand }}>
            {children}
        </SocketContextInstance.Provider>
    );
}

export const useSocketContext = () => {
    return React.useContext(SocketContextInstance);
};