import React, { useRef, useEffect, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';
import { Button } from './ui/button';
import { Card } from './ui/card';

const ObjectDetection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load model
  async function loadModel() {
    try {
      await tf.setBackend('webgl');
      await tf.ready();
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
      console.log('Model loaded.');
    } catch (err) {
      console.error(err);
      setError('Failed to load the model. Please try again.');
    }
  }

  useEffect(() => {
    loadModel();
  }, []);

  const detectFrame = async (video: HTMLVideoElement, model: cocoSsd.ObjectDetection) => {
    if (video.readyState === 4) {
        const predictions = await model.detect(video);
        renderPredictions(predictions);
    }
    requestAnimationFrame(() => {
        if(isDetecting) {
            detectFrame(video, model);
        }
    });
  };

  const startDetection = async () => {
    if (!model) return;
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
        });

        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadeddata = () => {
                setIsDetecting(true);
                detectFrame(videoRef.current!, model);
            }
        }
    } catch (err) {
        console.error("Error accessing webcam: ", err);
        setError('Could not access the webcam. Please ensure you have a webcam enabled and have granted permission.');
    }
  };

  const stopDetection = () => {
    setIsDetecting(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    }
  };

  const renderPredictions = (predictions: cocoSsd.DetectedObject[]) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";

    predictions.forEach(prediction => {
      const [x, y, width, height] = prediction.bbox;
      
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      ctx.fillStyle = "rgba(0, 255, 255, 0.2)";
      ctx.fillRect(x, y, width, height);

      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10);
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
      
      ctx.fillStyle = "#000000";
      ctx.fillText(prediction.class, x, y);
    });
  };

  useEffect(() => {
    return () => {
        stopDetection();
    }
  }, []);

  return (
    <Card className="bg-slate-800 border-slate-700 p-4">
      <h3 className="text-lg font-semibold mb-3 text-orange-400">Real-time Object Detection</h3>
      <div className="flex flex-col items-center space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        <div className="relative w-full max-w-lg aspect-video bg-black rounded-lg overflow-hidden">
            <video
                ref={videoRef}
                className="w-full h-full"
                autoPlay
                playsInline
                muted
            />
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0"
            />
        </div>
        {model ? (
          isDetecting ? (
            <Button onClick={stopDetection} className="bg-red-600 hover:bg-red-700 text-white">
              Stop Detection
            </Button>
          ) : (
            <Button onClick={startDetection} className="bg-green-500 hover:bg-green-600 text-white">
              Start Webcam Detection
            </Button>
          )
        ) : (
          <p>Loading model... this may take a moment.</p>
        )}
      </div>
    </Card>
  );
};

export default ObjectDetection;
