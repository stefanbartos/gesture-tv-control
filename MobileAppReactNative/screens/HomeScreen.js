import React from 'react';
import { Button, Text } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <>
      <Button
        title='Open camera'
        onPress={() => {
          navigation.navigate('Camera')
        }}
      />
      <Button
        title='Websocket test'
        onPress={() => {
          navigation.navigate('SocketScreen')
        }}
      />
    </>
  );
}

export default HomeScreen;
