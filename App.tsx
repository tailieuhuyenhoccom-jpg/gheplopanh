
import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const App: React.FC = () => {
    const [layer1, setLayer1] = useState<string | null>(null);
    const [layer2, setLayer2] = useState<string | null>(null);
    const [layer3, setLayer3] = useState<string | null>(null);
    const [layer4, setLayer4] = useState<string | null>(null);

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const layers = [layer1, layer2, layer3, layer4];
    const uploaderData = [
        { label: "Lớp thứ 1", image: layer1, setter: setLayer1 },
        { label: "Lớp thứ 2", image: layer2, setter: setLayer2 },
        { label: "Lớp thứ 3", image: layer3, setter: setLayer3 },
        { label: "Lớp thứ 4", image: layer4, setter: setLayer4 },
    ];

    const handleOpenPreview = (dataUrl: string) => {
        if (dataUrl) {
            setPreviewImage(dataUrl);
            setIsPreviewOpen(true);
        }
    };
    
    const handleClosePreview = () => {
        setIsPreviewOpen(false);
        setPreviewImage(null);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto max-w-7xl">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400">Trình ghép lớp ảnh</h1>
                    <p className="text-gray-400 mt-2">Tải lên 4 lớp ảnh để tạo thành một hình ảnh hoàn chỉnh.</p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="lg:sticky lg:top-8">
                        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-300">Hình kết quả</h2>
                        <ResultDisplay layers={layers} onOpenPreview={handleOpenPreview} />
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-300">Tải ảnh lên</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {uploaderData.map((data, index) => (
                                <ImageUploader
                                    key={index}
                                    label={data.label}
                                    image={data.image}
                                    onImageUpload={data.setter}
                                />
                            ))}
                        </div>
                    </div>
                </main>

                 <footer className="text-center mt-12 py-4 border-t border-gray-700">
                    <p className="text-gray-500">Phát triển bởi Nguyễn Thành Đạt</p>
                </footer>
            </div>

            {isPreviewOpen && previewImage && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-modal-enter"
                    onClick={handleClosePreview}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="preview-title"
                >
                    <button
                        onClick={(e) => { e.stopPropagation(); handleClosePreview(); }}
                        className="absolute top-4 right-4 p-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300 z-[51]"
                        aria-label="Đóng xem trước"
                    >
                        <CloseIcon className="w-8 h-8" />
                    </button>
                    <div 
                        className="relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                       <h2 id="preview-title" className="sr-only">Xem trước hình ảnh</h2>
                       <img 
                         src={previewImage} 
                         alt="Xem trước ảnh ghép"
                         className="object-contain max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl shadow-cyan-500/30"
                       />
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
