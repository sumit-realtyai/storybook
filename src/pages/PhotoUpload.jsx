import { useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import useChildStore from '../store/childStore';
import { PhotoIcon, CheckCircleIcon, XCircleIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

function PhotoUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Get all query parameters
  const book_id = queryParams.get('book_id');
  const childName = queryParams.get('name') || useChildStore((state) => state.childName);
  const gender = queryParams.get('gender');
  const age = queryParams.get('age');
  const birthMonth = queryParams.get('birthMonth');
  
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState([]);
  const [req_id, setRequestId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (file, request_id) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      // First API call to get file URL
      const response = await axios.post('https://is510t1jgd.execute-api.ap-south-1.amazonaws.com/api/photo/original_image', formData);
      const { file_url } = await response.data;

      // Second API call to add photo to queue
      const queueResponse = await axios.post('https://is510t1jgd.execute-api.ap-south-1.amazonaws.com/api/photo/add_photo_to_queue', {
        file_name: file.name,
        file_url,
        request_id,
      });

      const { photo_id } = await queueResponse.data;

      return { success: true, photo_id };
    } catch (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploadedFiles(acceptedFiles);
    setIsUploading(true);
    setUploadStatus([]); // Reset status

    // Generate a dummy request ID (in production this should come from your backend)
    const request_id = `req_${Math.random().toString(36).substr(2, 9)}`;
    setRequestId(request_id);
    
    // Process each file individually
    const statusResults = [];
    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      const result = await handleImageUpload(file, request_id);
      statusResults.push(result);
      // Update status immediately after each file is processed
      setUploadStatus([...statusResults]);
    }
    
    setIsUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: true,
    maxFiles: 4,
  });

  const handleShowPreview = () => {
    if (uploadStatus.every(status => status.success) && req_id) {
      // Create query params with all details for preview page
      const previewParams = new URLSearchParams({
        request_id: req_id,
        book_id: "6818cab3bfb946189a94960c", // for now passing constant book_id
        name: childName,
        gender: gender || '',
        age: age || '',
        birthMonth: birthMonth || ''
      });
      
      navigate(`/preview?${previewParams.toString()}`);
    }
  };

  // Check if all photos are successfully uploaded
  const allPhotosUploaded = uploadedFiles.length >= 2 && 
                           uploadStatus.length === uploadedFiles.length && 
                           uploadStatus.every(status => status.success) &&
                           !isUploading;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <div className="flex items-center justify-center mb-6">
          <BookOpenIcon className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          {childName}'s Story Photos
        </h2>
        <p className="text-center text-lg mb-8 text-gray-600">Upload 2 to 4 photos of {childName}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="font-semibold mb-4 text-gray-800">Photo Guidelines</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
                <span>Solo Photos Only</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
                <span>Front Facing & Smiling</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircleIcon className="h-6 w-6 text-red-500" />
                <span>No Sunglasses or Caps</span>
              </div>
            </div>
          </div>

          <div
            {...getRootProps()}
            className={`border-3 border-dashed border-blue-200 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 transition duration-300 relative bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:16px_16px] ${isDragActive ? 'border-blue-400 bg-blue-50' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <PhotoIcon className="h-12 w-12 mx-auto text-blue-400" />
              <p className="text-lg font-medium text-gray-700">
                {isDragActive ? "Drop your photos here" : "Drop your photos here"}
              </p>
              <p className="text-sm text-gray-500">or click to select files</p>
              <p className="text-xs text-gray-400">Minimum 2 photos required</p>
            </div>
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium mb-2">Selected Photos:</h4>
            <div className="flex gap-2 flex-wrap">
              {uploadedFiles.map((file, index) => (
                <div key={index} className={`bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2`}>
                  <span>{file.name}</span>
                  {isUploading && index >= uploadStatus.length && (
                    <span className="text-blue-500">⏳</span>
                  )}
                  {uploadStatus[index] && (
                    <span className={uploadStatus[index].success ? "text-green-500" : "text-red-500"}>
                      {uploadStatus[index].success ? "✓" : "✗"}
                    </span>
                  )}
                </div>
              ))}
            </div>
            {isUploading && (
              <p className="text-sm text-blue-600 mt-2">Uploading photos...</p>
            )}
          </div>
        )}

        <button
          onClick={handleShowPreview}
          disabled={!allPhotosUploaded}
          className={`w-full py-3 px-6 rounded-full text-lg font-semibold transition duration-300 ${
            !allPhotosUploaded
              ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
              : 'bg-secondary text-white hover:bg-blue-600'
          }`}
        >
          {isUploading ? 'Uploading Photos...' : `Show ${childName}'s Book Preview`}
        </button>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-yellow-400 text-2xl">★★★★★</span>
            <span className="font-medium">Excellent on Google</span>
          </div>
          <p className="text-sm text-gray-600">4.9 out of 5 based on 97 reviews</p>
        </div>
      </div>
    </div>
  );
}

export default PhotoUpload;