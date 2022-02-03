import React, { useRef } from "react";
import Webcam from "react-webcam";
import "./App.css";

export default function Video() {
  const webcamRef = useRef(null);
  return (
    <>
      <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={1280}
        style={{
          position: "fixed",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "left",
          width: "100%",
          height: "100%",
        }}
      />
    </>
  );
}
