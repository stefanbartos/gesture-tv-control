import React from 'react';
import { useFrameProcessor } from 'react-native-vision-camera';

const CameraFlow = () => {
  const frameProcessor = useFrameProcessor((frame) => {
    console.log(frame);
  }, []);
}

export default CameraFlow;
