import React from 'react';

interface ResultDisplayProps {
    layers: (string | null)[];
}

const PhotoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);


const ResultDisplay: React.FC<ResultDisplayProps> = ({ layers }) => {
    const hasImages = layers.some(layer => layer !== null);

    const handleDownload = async () => {
        const validLayers = layers.filter((l): l is string => l !== null);
        if (validLayers.length === 0) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            alert('Failed to get canvas context.');
            return;
        }

        try {
            const imagePromises = validLayers.map(src => {
                return new Promise<HTMLImageElement>((resolve, reject) => {
                    const img = new Image();
                    img.crossOrigin = 'anonymous'; // Prevent canvas tainting issues
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

                const dataUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'composite-image.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error("Error creating composite image:", error);
            alert(`Could not download image. ${error instanceof Error ? error.message : 'An unknown error occurred.'}`);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="aspect-square w-full max-w-xl mx-auto bg-gray-800 rounded-lg border-2 border-gray-700 flex items-center justify-center overflow-hidden relative shadow-lg shadow-cyan-500/10">
                {hasImages ? (
                    layers.map((layer, index) =>
                        layer ? (
                            <img
                                key={index}
                                src={layer}
                                alt={`Layer ${index + 1}`}
                                className="absolute top-0 left-0 w-full h-full object-cover"
                                style={{ zIndex: index + 1 }}
                            />
                        ) : null
                    )
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