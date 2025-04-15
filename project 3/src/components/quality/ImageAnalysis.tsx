import React from 'react';
import { Camera, Upload, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { analyzeImage } from '@/lib/ai/vision';
import { supabase } from '@/lib/supabase/client';

interface ImageAnalysisProps {
  orderId: string;
  onAnalysisComplete: (result: { isCorrect: boolean; details: string }) => void;
}

export function ImageAnalysis({ orderId, onAnalysisComplete }: ImageAnalysisProps) {
  const [image, setImage] = React.useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<{
    isCorrect: boolean;
    details: string;
  } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = React.useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Failed to access camera. Please ensure camera permissions are granted.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  React.useEffect(() => {
    if (showCamera) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [showCamera]);

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      setImage(imageDataUrl);
      setShowCamera(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeOrderImage = async () => {
    if (!image) return;

    try {
      setIsAnalyzing(true);

      // First upload the image to Supabase storage
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('items')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      const imageBlob = await fetch(image).then(r => r.blob());
      const fileName = `${orderId}-analysis-${Date.now()}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('order-verification')
        .upload(`analysis/${fileName}`, imageBlob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('order-verification')
        .getPublicUrl(`analysis/${fileName}`);

      // Generate prompt based on order items
      const itemsList = orderData.items
        .map((item: any) => `${item.quantity}x ${item.name}`)
        .join(', ');

      const prompt = `This is a food order verification image. The order should contain: ${itemsList}. 
        Please analyze the image and verify:
        1. Are all items present?
        2. Do the quantities match?
        3. Does the presentation match standard quality?
        Provide a detailed analysis and indicate if the order is correct or needs attention.`;

      const analysis = await analyzeImage(publicUrl, prompt);

      // Parse the analysis to determine if order is correct
      const isCorrect = analysis.content.toLowerCase().includes('correct') && 
        !analysis.content.toLowerCase().includes('missing') &&
        !analysis.content.toLowerCase().includes('incorrect');

      const result = {
        isCorrect,
        details: analysis.content
      };

      setAnalysisResult(result);
      onAnalysisComplete(result);

      // Store analysis result
      await supabase.from('ai_analysis').insert({
        restaurant_id: (await supabase.auth.getUser()).data.user?.id,
        analysis_type: 'order_verification',
        data: {
          order_id: orderId,
          image_url: publicUrl,
          items: orderData.items,
        },
        recommendations: [result],
        confidence_score: 0.95,
      });

    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      {showCamera ? (
        <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="h-full w-full object-cover"
          />
          <button
            onClick={captureImage}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white p-4 shadow-lg"
          >
            <Camera className="h-6 w-6" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowCamera(true)}
              className="flex items-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              <Camera className="h-5 w-5" />
              <span>Take Photo</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
            >
              <Upload className="h-5 w-5" />
              <span>Upload Image</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {image && (
            <>
              <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
                <img
                  src={image}
                  alt="Order verification"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex justify-center">
                <button
                  onClick={analyzeOrderImage}
                  disabled={isAnalyzing}
                  className="flex items-center space-x-2 rounded-lg bg-green-500 px-6 py-2 text-white hover:bg-green-600 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>Analyze Order</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {analysisResult && (
        <div className={`rounded-lg border p-4 ${
          analysisResult.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
        }`}>
          <div className="flex items-center space-x-2">
            {analysisResult.isCorrect ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <h3 className="font-medium">
              {analysisResult.isCorrect ? 'Order Verified' : 'Issues Detected'}
            </h3>
          </div>
          <p className="mt-2 text-sm">{analysisResult.details}</p>
        </div>
      )}
    </div>
  );
}