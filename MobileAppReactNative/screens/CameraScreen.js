import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

const CameraScreen = () => {
  useEffect(async () => {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    console.log(cameraPermission);
  }, []);

  const devices = useCameraDevices('wide-angle-camera');

  if (!devices) return (<Text>Loading devices</Text>);
  const device = devices.front;

  if (!device) return (<Text>No fucking camera!</Text>);
  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CameraScreen;
