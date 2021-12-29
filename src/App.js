import React, { useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import { drawMesh } from "./utilities";

function App() 
{
  //setup webcam and canvas
  const webcamRef = useRef(null); //initial value = null
  const canvasRef = useRef(null); //initial value = null

  // (access ref value as reference.current
  //update it by assinging new value)
 
  // to detect human pose / expressions
  const runFacemesh = async () => {
    const net = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);
    

    setInterval(() => {
      //callind detect function after 10ms
      detect(net);
    }, 10);

  };

   //detect model
  const detect = async (net) => {
    //check cam is not undefined or null , and it is receiving data
    if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video. readyState === 4) 
    {
      // it Get Video  tag + its height + its width(from webcam tab below) Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // console.log("video = " , video , videoWidth , videoHeight);

      // Set video width 
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set CANVAS width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // make detection
      //estmateface is tensor flow method to estimate face features by take input of video
      const face = await net.estimateFaces({input:video});
      // face= it is  array with all small deails about expressions
      console.log( face);

      // canvas context for drawing
      const ctx = canvasRef.current.getContext("2d");
      requestAnimationFrame(()=>{drawMesh(face, ctx)});
    }
  };
  // runFacemesh();


  useEffect(()=>{runFacemesh()}, []);

  return (
    <>
    {/* camera view */}
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 540,
            height: 380,
          }}/>

    {/*  canvas face mask */}
         
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 540,
            height: 380,
          }}/>
     
    </>
  );
}

export default App;
