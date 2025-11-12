
import React from 'react';

interface ResultDisplayProps {
    layers: (string | null)[];
    onOpenPreview: (dataUrl: string) => void;
}

const PhotoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const ExpandIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1v4m0 0h-4m4 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5 5" />
    </svg>
);

const ResultDisplay: React.FC<ResultDisplayProps> = ({ layers, onOpenPreview }) => {
    const hasImages = layers.some(layer => layer !== null);

    const createCompositeImage = async (): Promise<string | null> => {
        const validLayers = layers.filter((l): l is string => l !== null);
        if (validLayers.length === 0) return null;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            alert('Failed to get canvas context.');
            return null;
        }

        try {
            const imagePromises = validLayers.map(src => {
                return new Promise<HTMLImageElement>((resolve, reject) => {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = () => resolve(img);
                    img.onerror = (err) => reject(new Error(`Failed to load image: ${src.substring(0, 30)}...`));
                    img.src = src;
                });
            });

            const loadedImages = await Promise.all(imagePromises);

            if (loadedImages.length > 0) {
                const firstImage = loadedImages[0];
                canvas.width = firstImage.naturalWidth;
                canvas.height = firstImage.naturalHeight;

                loadedImages.forEach(img => {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                });

                return canvas.toDataURL('image/png');
            }
            return null;
        } catch (error) {
            console.error("Error creating composite image:", error);
            alert(`Could not create image. ${error instanceof Error ? error.message : 'An unknown error occurred.'}`);
            return null;
        }
    };

    const handleDownload = async () => {
        const dataUrl = await createCompositeImage();
        if (dataUrl) {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'composite-image.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleOpenPreview = async () => {
        const dataUrl = await createCompositeImage();
        if (dataUrl) {
            onOpenPreview(dataUrl);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="aspect-square w-full max-w-xl mx-auto bg-gray-800 rounded-lg border-2 border-gray-700 flex items-center justify-center overflow-hidden relative shadow-lg shadow-cyan-500/10">
                {hasImages ? (
                    <>
                        {layers.map((layer, index) =>
                            layer ? (
                                <img
                                    key={index}
                                    src={layer}
                                    alt={`Layer ${index + 1}`}
                                    className="absolute top-0 left-0 w-full h-full object-cover"
                                />
                            ) : null
                        )}
                        <button
                            onClick={handleOpenPreview}
                            className="absolute top-3 right-3 z-20 p-2 bg-black bg-opacity-60 rounded-full text-white hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-400 transition-all duration-300 animate-button-fade-in"
                            aria-label="Xem trước toàn màn hình"
                        >
                            <ExpandIcon className="w-6 h-6" />
                        </button>
                    </>
                ) : (
                    <div className="text-center text-gray-500">
                        <PhotoIcon />
                        <p>Hình ảnh kết quả sẽ hiển thị ở đây</p>
                    </div>
                )}
            </div>
             <button
                onClick={handleDownload}
                disabled={!hasImages}
                aria-disabled={!hasImages}
                className="mt-6 w-full max-w-xl px-6 py-3 bg-cyan-500 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300"
            >
                Tải xuống ảnh ghép
            </button>
        </div>
    );
};

export default ResultDisplay;
