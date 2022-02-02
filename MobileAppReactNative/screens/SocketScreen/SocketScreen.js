import React, { useEffect, useState } from 'react';
import { Alert, Button, Text, StyleSheet, View } from 'react-native';
import io from 'socket.io-client';

const URL_FULL = 'ws://172.16.12.73:2424/socket.io/?transport=websocket';
const URL = 'ws://172.16.12.73:2424';

const socket = io(URL, {
  path: '/socket.io',
  autoConnect: true,
  transports: ['websocket'],
}); // replace with the IP of your server, when testing on real devices

class SocketScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: socket.connected,
      currentTransport: socket.connected ? socket.io.engine.transport.name : '-',
      lastMessage: ""
    };
  }

  componentDidMount() {
    socket.on('connect', () => this.onConnectionStateUpdate());
    socket.on('disconnect', () => this.onConnectionStateUpdate());
    socket.on('message', (content) => this.onMessage(content));
    socket.on('connect_error', (e) => console.log(e.message));
  }

  componentWillUnmount() {
    socket.off('connect');
    socket.off('disconnect');
    socket.off('message');
  }

  onConnectionStateUpdate() {
    this.setState({
      connected: socket.connected,
      currentTransport: socket.connected ? socket.io.engine.transport.name : '-'
    });
    if (socket.connected) {
      socket.io.engine.on('upgrade', () => this.onUpgrade());
    } else {
      socket.io.engine.off('upgrade');
    }
  }

  onMessage(content) {
    this.setState({
      lastMessage: content
    });
  }

  onUpgrade() {
    this.setState({
      currentTransport: socket.io.engine.transport.name
    });
  }

  sendTestMessage() {
    const testMessage = {
      "tvID":12345,
      "type":"command",
      "value":"PLAY"
    };

    socket.send(JSON.stringify(testMessage));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>State: { this.state.connected ? 'Connected' : 'Disconnected' }</Text>
        <Text>Current transport: { this.state.currentTransport }</Text>
        <Text>Last message: { this.state.lastMessage }</Text>

        <Button title='Send test message' onPress={this.sendTestMessage} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default SocketScreen;
