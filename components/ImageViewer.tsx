
import React from 'react';
import { DownloadIcon } from './Icons';

interface ImageViewerProps {
  originalImage: string | null;
  editedImage: string | null;
  isLoading: boolean;
}

const ImagePanel: React.FC<{ title: string; imageUrl: string | null; children?: React.ReactNode; showPlaceholder?: boolean }> = ({ title, imageUrl, children, showPlaceholder = false }) => (
    <div className="flex-1 flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-center text-gray-300">{title}</h3>
        <div className="relative w-full aspect-square bg-gray-900/50 rounded-lg overflow-hidden flex items-center justify-center border border-gray-700">
            {imageUrl ? (
                <img src={imageUrl} alt={title} className="object-contain w-full h-full" />
            ) : showPlaceholder && (
                 <div className="text-gray-500">Your image will appear here.</div>
            )}
            {children}
        </div>
    </div>
);


export const ImageViewer: React.FC<ImageViewerProps> = ({ originalImage, editedImage, isLoading }) => {
    if (!originalImage) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                Upload an image to get started
            </div>
        );
    }
    
  return (
    <div className="flex flex-col md:flex-row gap-6 h-full">
      <ImagePanel title="Original" imageUrl={originalImage} />

      <ImagePanel title="Edited" imageUrl={editedImage} showPlaceholder={!isLoading}>
        {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center backdrop-blur-sm">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400"></div>
                <p className="mt-4 text-white">Processing...</p>
            </div>
        )}
        {editedImage && (
             <a
                href={editedImage}
                download="edited-image.png"
                className="absolute bottom-4 right-4 bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm px-4"
             >
                <DownloadIcon />
                Download
            </a>
        )}
      </ImagePanel>
    </div>
  );
};
