"use client";

import type React from "react";

import { useRef, useState, useEffect } from "react";
import { Camera, X, RotateCcw, Upload, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMobile } from "@/hooks/use-mobile";

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  onCancel: () => void;
}

export default function CameraCapture({
  onCapture,
  onCancel,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"camera" | "upload">("camera");
  const isMobile = useMobile();
  const [usingCapacitor, setUsingCapacitor] = useState(false);

  useEffect(() => {
    // Check if we're running in Capacitor
    const isCapacitor = typeof (window as any).Capacitor !== "undefined";
    setUsingCapacitor(isCapacitor);

    if (isCapacitor || activeTab !== "camera") {
      // Don't start camera if using Capacitor or if on upload tab
      return;
    }

    const startCamera = async () => {
      try {
        const constraints = {
          video: {
            facingMode: isMobile ? "environment" : "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(
          constraints
        );
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setCameraError("Could not access camera. Please check permissions.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isMobile, activeTab]);

  const captureImage = async () => {
    if (usingCapacitor) {
      try {
        // Import Capacitor Camera plugin dynamically
        const { Camera, CameraResultType, CameraSource } = await import(
          "@capacitor/camera"
        );

        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera,
        });

        if (image.dataUrl) {
          setCapturedImage(image.dataUrl);
        }
      } catch (error) {
        console.error("Error taking photo with Capacitor:", error);
        setCameraError("Could not take photo. Please try again.");
      }
    } else {
      // Web camera capture
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the current video frame on the canvas
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Convert canvas to data URL
          const imageSrc = canvas.toDataURL("image/jpeg");
          setCapturedImage(imageSrc);
        }
      }
    }
  };

  const handleFileUpload = async () => {
    if (usingCapacitor) {
      try {
        // Import Capacitor Camera plugin dynamically
        const { Camera, CameraResultType, CameraSource } = await import(
          "@capacitor/camera"
        );

        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Photos, // Use photo library instead of camera
        });

        if (image.dataUrl) {
          setCapturedImage(image.dataUrl);
        }
      } catch (error) {
        console.error("Error selecting photo with Capacitor:", error);
        setCameraError("Could not select photo. Please try again.");
      }
    } else {
      // Trigger file input click for web
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setCapturedImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const confirmImage = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  const retakeImage = () => {
    setCapturedImage(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Add Ingredients</h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {cameraError && activeTab === "camera" ? (
        <div className="text-center p-4">
          <p className="text-destructive mb-2">{cameraError}</p>
          <p className="text-sm mb-4">Try uploading an image instead.</p>
          <Button variant="outline" onClick={() => setActiveTab("upload")}>
            <Upload className="mr-2 h-4 w-4" /> Upload Image
          </Button>
        </div>
      ) : (
        <>
          {!capturedImage && (
            <Tabs
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as "camera" | "upload")
              }
              className="mb-4"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="camera">
                  <Camera className="mr-2 h-4 w-4" /> Camera
                </TabsTrigger>
                <TabsTrigger value="upload">
                  <Upload className="mr-2 h-4 w-4" /> Upload
                </TabsTrigger>
              </TabsList>

              <TabsContent value="camera" className="mt-2">
                <div className="relative aspect-video bg-black rounded-md overflow-hidden">
                  {!usingCapacitor && (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </TabsContent>

              <TabsContent value="upload" className="mt-2">
                <div className="relative aspect-video bg-muted rounded-md overflow-hidden flex flex-col items-center justify-center p-4">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-center text-muted-foreground mb-4">
                    Select an image from your device
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </TabsContent>
            </Tabs>
          )}

          {capturedImage && (
            <div className="relative aspect-video bg-black rounded-md overflow-hidden mb-4">
              <img
                src={capturedImage || "/placeholder.svg"}
                alt="Captured"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />

          <div className="flex justify-center gap-4 mt-4">
            {!capturedImage ? (
              activeTab === "camera" ? (
                <Button
                  size="lg"
                  className="rounded-full h-14 w-14 flex items-center justify-center"
                  onClick={captureImage}
                >
                  <Camera className="h-6 w-6" />
                </Button>
              ) : (
                <Button size="lg" onClick={handleFileUpload}>
                  <Upload className="mr-2 h-4 w-4" /> Select Image
                </Button>
              )
            ) : (
              <>
                <Button variant="outline" size="lg" onClick={retakeImage}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Retake
                </Button>
                <Button size="lg" onClick={confirmImage}>
                  Use Image
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </Card>
  );
}
