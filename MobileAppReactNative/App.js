import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, Alert } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

const App = () => (
  <SafeAreaView>
    <View>
      <Text>Select something</Text>
      <Button
        title="Load QR"
        onPress={() => Alert.alert('Simple Button pressed')}
      />
      <Button
        title="Open camera"
        color="#f194ff"
        onPress={() => Alert.alert('Button with adjusted color pressed')}
      />
    </View>
  </SafeAreaView>
);

export default App;
