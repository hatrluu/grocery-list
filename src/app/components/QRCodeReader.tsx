import jsQR from 'jsqr';
import { Camera, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const QRCodeReader = () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [error, setError] = useState<string>('');
    const [isCapturing, setIsCapturing] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const router = useRouter();

    // Scanner interval for live detection
    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (isCapturing) {
            intervalId = setInterval(() => {
                scanVideoFrame();
            }, 500); // Scan every 500ms
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isCapturing]);

    const scanVideoFrame = () => {
        if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            const canvas = document.createElement('canvas');
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            const code = jsQR(imageData.data, imageData.width, imageData.height);
            if (code) {
                imageProcessed(code.data);
                stopCamera();
            }
        }
    };

    const startCamera = async () => {
        try {
            setIsCapturing(true);
            
            // Check if mediaDevices API is available
            if (!navigator.mediaDevices) {
                throw new Error(
                    'Camera access is not supported by your browser or requires HTTPS. ' +
                    'Please try using a different browser or ensure you\'re accessing the site via HTTPS.'
                );
            }
            
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setError('');
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            setError(`Unable to access camera: ${errorMessage}`);
            setIsCapturing(false); // Reset capturing state on error
        }
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setIsCapturing(false);
        }
    };

    const processImage = async (imageElement: HTMLImageElement) => {
        setIsProcessing(true);
        setError('');

        try {
            const canvas = document.createElement('canvas');
            canvas.width = imageElement.width;
            canvas.height = imageElement.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');

            ctx.drawImage(imageElement, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            const code = jsQR(imageData.data, imageData.width, imageData.height);
            if (code) {
                imageProcessed(code.data);
            } else {
                setError('No QR code found in image');
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            setError(`Error processing image: ${errorMessage}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const imageProcessed = (url: string) => {
        console.log(url);
        const urlFrag = url.split('/');
        router.push(`/qr/${urlFrag[urlFrag.length-1]}`);
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.includes('image/')) {
                setError('Please upload an image file');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                const img = new Image();
                img.onload = () => {
                    if (e.target?.result && typeof e.target.result === 'string') {
                        setImageUrl(e.target.result);
                        processImage(img);
                    }
                };
                if (e.target?.result && typeof e.target.result === 'string') {
                    img.src = e.target.result;
                }
            };
            reader.onerror = () => {
                setError('Error reading file');
            };
            reader.readAsDataURL(file);
        }
    };

    const reset = () => {
        setImageUrl(null);
        setError('');
        setIsProcessing(false);
    };

    return (
        <div className="w-full max-w-md mx-auto p-4 space-y-4">
            {error && (
                <div className="bg-red-400">
                    <h3>Error</h3>
                    <p>{error}</p>
                </div>
            )}

            <div className="space-y-4">
                {!isCapturing && !imageUrl && (
                    <div className="flex gap-4">
                        <button
                            onClick={startCamera}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            <Camera className="w-4 h-4" />
                            Scan QR Code
                        </button>

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 dark:bg-gray-800"
                        >
                            <Upload className="w-4 h-4" />
                            Upload QR Image
                        </button>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                )}

                {isCapturing && (
                    <div className="space-y-4">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full rounded border"
                        />
                        <button
                            onClick={stopCamera}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {imageUrl && (
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <button
                                onClick={reset}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Scan Another
                            </button>
                        </div>
                    </div>
                )}

                {isProcessing && (
                    <div className="text-center text-gray-500">
                        Processing QR code...
                    </div>
                )}
            </div>
        </div>
    );
};

export default QRCodeReader;
