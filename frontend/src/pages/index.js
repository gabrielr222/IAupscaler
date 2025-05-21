// frontend/src/pages/index.js
import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function ImageEnhancer() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [enhancedImageUrl, setEnhancedImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
    setEnhancedImageUrl(null);
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await axios.post("https://TU_BACKEND_URL/api/enhance", formData);
      setEnhancedImageUrl(response.data.imageUrl);
    } catch (error) {
      console.error("Error enhancing image:", error);
      alert("There was an error enhancing your image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Enhance Your Image with AI</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4"
      />
      <Button onClick={handleSubmit} disabled={loading || !selectedImage}>
        {loading ? "Processing..." : "Upload & Enhance"}
      </Button>
      {enhancedImageUrl && (
        <div className="mt-6">
          <p className="mb-2">Your enhanced image is ready:</p>
          <img
            src={enhancedImageUrl}
            alt="Enhanced"
            className="max-w-full max-h-96 border border-white rounded"
          />
          <a
            href={enhancedImageUrl}
            download
            className="block mt-2 underline text-blue-400"
          >
            Download Image
          </a>
        </div>
      )}
    </div>
  );
}