import React, { useRef, useEffect, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import "./App.css";

import { throttle } from 'lodash';
import { useSocketContext } from './SocketContext';

const server_base_url = 'https://172.16.12.251:8080';
const model_url = `${server_base_url}/model.json`;

function Video() {
  const webcamRef: React.MutableRefObject<Webcam | null> = useRef(null);
  const canvasRef: React.MutableRefObject<HTMLCanvasElement | null> = useRef(null);

  const { sendCommand } = useSocketContext();

  const throttledFn = useCallback(throttle((cmd: 'PLAY' | 'PAUSE' | 'RETURN') => {
    sendCommand(cmd);
  }, 3000), []);

  const downloadModel = async () => {
    const net = await tf.loadGraphModel(model_url);
    setInterval(() => {
      detect(net);
    }, 16.7);
  }


  const detect = async (net: tf.GraphModel) => {
    // console.log(fps);
    // Check data is available
    if (webcamRef?.current?.video?.readyState === 4) {

      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;


      // 4. TODO - Make Detections
      const img = tf.browser.fromPixels(video)
      const resized = tf.image.resizeBilinear(img, [640, 480])
      const casted = resized.cast('int32')
      const expanded = casted.expandDims(0)
      const obj = await net.executeAsync(expanded) as tf.Tensor[]

      const boxes = await obj[4].array()
      const classes = await obj[5].array()
      const scores = await obj[6].array()

      // Draw mesh

      // if (canvasRef.current) {
      //   // Set canvas height and width
      //   canvasRef.current.width = videoWidth;
      //   canvasRef.current.height = videoHeight;
      //   const ctx = canvasRef.current.getContext("2d");

      //   requestAnimationFrame(() => {
      //     // @ts-ignore
      //     drawRect(boxes[0], classes[0], scores[0], 0.9, videoWidth, videoHeight, ctx)
      //   });
      // }

      if (scores[0] > 0.9) {
        const cmd = (classes[0] === 0) ? 'PLAY' : classes[1] === 1 ? 'RETURN' : 'PAUSE';
        throttledFn(cmd)
      }

      // 5. TODO - Update drawing utility
      // drawSomething(obj, ctx)  
      // console.log(classes);

      tf.dispose(img)
      tf.dispose(resized)
      tf.dispose(casted)
      tf.dispose(expanded)
      tf.dispose(obj)

    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
  }

  useEffect(() => {
    downloadModel()
  }, [])

  return (
    <>
      <Webcam
        audio={false}
        height={480}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        screenshotQuality={0.8}
        width={640}
        // videoConstraints={{
        //   facingMode: "environment"
        // }}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          // width: 640,    
          height: 480,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "left",
          zIndex: 8,
          width: 640,
          height: 480,
        }}
      />
    </>
  );

}

export default Video;
