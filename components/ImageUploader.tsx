
import React, { useRef } from 'react';

interface ImageUploaderProps {
    label: string;
    image: string | null;
    onImageUpload: (imageDataUrl: string | null) => void;
}

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const ImageUploader: React.FC<ImageUploaderProps> = ({ label, image, onImageUpload }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (typeof e.target?.result === 'string') {
                    onImageUpload(e.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onImageUpload(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div className="flex flex-col items-center">
            <label className="text-lg font-medium text-gray-300 mb-2">{label}</label>
            <div
                className="relative aspect-square w-full bg-gray-800 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer hover:border-cyan-400 hover:bg-gray-700 transition-all duration-300 group overflow-hidden"
                onClick={handleClick}
            >
                <input
                    type="file"
                    accept="image/*"
                    ref={inputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
                {image ? (
                    <>
                        <img src={image} alt={label} className="object-cover w-full h-full" />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                           <span className="text-white font-semibold">Thay đổi ảnh</span>
                        </div>
                        <button
                            onClick={handleDelete}
                            className="absolute top-2 right-2 z-10 p-1 bg-black bg-opacity-60 rounded-full text-white hover:bg-red-500 hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition-all duration-300"
                            aria-label={`Xóa ${label}`}
                        >
                            <CloseIcon className="w-5 h-5" />
                        </button>
                    </>
                ) : (
                    <div className="text-center">
                        <UploadIcon />
                        <p className="mt-2 text-sm text-gray-400">Bấm để tải ảnh lên</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUploader;
