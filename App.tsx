
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ImageViewer } from './components/ImageViewer';
import { MagicWandIcon } from './components/Icons';
import { editImage } from './services/geminiService';

// Helper function to convert File to Base64
const fileToBase64 = (file: File): Promise<{ base64: string, mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = (error) => reject(error);
  });
};


function App() {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((file: File) => {
    setOriginalImage(file);
    setEditedImage(null); // Clear previous edit on new image upload
    setError(null);
  }, []);

  const handleSubmit = async () => {
    if (!originalImage || !prompt) {
      setError('Please upload an image and provide an editing instruction.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const { base64, mimeType } = await fileToBase64(originalImage);
      const newImageBase64 = await editImage(base64, mimeType, prompt);
      setEditedImage(`data:image/png;base64,${newImageBase64}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const originalImageUrl = originalImage ? URL.createObjectURL(originalImage) : null;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
      <header className="py-4 px-6 shadow-md bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 w-full">
        <h1 className="text-2xl font-bold text-center tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Photo Magic: AI Image Editor
        </h1>
      </header>
      
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col gap-6">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-lg font-semibold mb-3 text-purple-300">1. Upload Photo</h2>
            <ImageUploader onImageUpload={handleImageUpload} />
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-lg font-semibold mb-3 text-purple-300">2. Describe Your Edit</h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Remove the background', 'Make the product pop with a vibrant background', 'Add a retro cinematic filter'..."
              className="w-full h-32 p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 placeholder-gray-400"
              disabled={!originalImage || isLoading}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!originalImage || !prompt || isLoading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
          >
            <MagicWandIcon />
            {isLoading ? 'Conjuring Magic...' : 'Generate'}
          </button>
          
          {error && <div className="text-red-400 bg-red-900/50 p-3 rounded-md text-sm border border-red-700">{error}</div>}
        </div>

        <div className="w-full lg:w-2/3 xl:w-3/4 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <ImageViewer 
            originalImage={originalImageUrl} 
            editedImage={editedImage} 
            isLoading={isLoading} 
          />
        </div>
      </main>
    </div>
  );
}

export default App;
