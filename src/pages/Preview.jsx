import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import useChildStore from '../store/childStore';
import axios from 'axios';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

function Preview() {
  const [searchParams] = useSearchParams();
  
  // Get all query parameters
  const request_id = searchParams.get('request_id');
  const book_id = searchParams.get('book_id');
  const childName = searchParams.get('name') || useChildStore((state) => state.childName);
  const gender = searchParams.get('gender');
  const age = searchParams.get('age');
  const birthMonth = searchParams.get('birthMonth');
  
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageData, setPageData] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [hasNextPage, setHasNextPage] = useState(true);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowSaveButton(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const pollUntilDone = async (req_id, job_id, page_number, book_id, maxRetries = 15, interval = 30000) => {
    let retries = 0;
    console.log("Polling started for job_id:", job_id, "with request_id:", req_id);
    
    const poll = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/photo/check_generation_status`, {
          headers: {
            "ngrok-skip-browser-warning": "true"
          },
          params: { req_id, job_id, page_number, book_id }
        });

        const data = res.data;
        console.log("Polling response:", data);
        if (data.status === 'completed' && data.image_urls) {
          return data;
        }

        if(data.status == "failed") {
          throw new Error("Image generation failed");
        }

        if (retries < maxRetries) {
          retries++;
          await new Promise(resolve => setTimeout(resolve, interval));
          return await poll();
        } else {
          throw new Error("Polling timed out");
        }

      } catch (error) {
        console.error("Polling error:", error);
        return { error: true };
      }
    };

    return await poll();
  };

  const fetchPageData = useCallback(async (pageNumber, book_id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/photo/get_generation_details`, {
        headers: {
          "ngrok-skip-browser-warning": "true"
        },
        params: {
          req_id: request_id,
          book_id,
          page_number: pageNumber
        },
      });

      const { job_id } = response.data;
      console.log('Job ID:', job_id);
      if (!job_id) {
        throw new Error("No job_id found in response");
      }
      
      const result = await pollUntilDone(request_id, job_id, pageNumber, book_id);
      return { ...result, pageNumber }; 

    } catch (error) {
      console.error('Error fetching page data:', error);
      return null;
    }
  }, [request_id]);

  useEffect(() => {
    let progressInterval;
    let isMounted = true;

    const loadPage = async () => {
      setLoadingMessage(`Loading page ${currentPage}`);

      const pageResult = await fetchPageData(currentPage, book_id);
      
      if (!isMounted) return;

      if (pageResult) {
        setPageData(prev => {
          const newPages = [...prev];
          newPages[pageResult.pageNumber - 1] = pageResult;
          return newPages;
        });
        
        // Initialize current image index for this page
        setCurrentImageIndexes(prev => ({
          ...prev,
          [pageResult.pageNumber - 1]: pageResult.image_idx || 0
        }));
        
        if (progressInterval) {
          clearInterval(progressInterval);
        }
        
        setIsLoading(false);
        setHasNextPage(pageResult.next || false);

        if (pageResult.next) {
          setCurrentPage(prev => prev + 1);
          setIsLoading(true);
        }
      }
    };

    loadPage();

    return () => {
      isMounted = false;
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [currentPage, fetchPageData, book_id]);

  const handleImageNavigation = useCallback((pageIndex, direction) => {
    const page = pageData[pageIndex];
    if (!page || !page.image_urls) return;

    const currentIndex = currentImageIndexes[pageIndex] || 0;
    const totalImages = page.image_urls.length;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % totalImages;
    } else {
      newIndex = currentIndex === 0 ? totalImages - 1 : currentIndex - 1;
    }

    setCurrentImageIndexes(prev => ({
      ...prev,
      [pageIndex]: newIndex
    }));
  }, [pageData, currentImageIndexes]);

  // Handle touch events for swipe functionality
  const handleTouchStart = useCallback((e, pageIndex) => {
    const touch = e.touches[0];
    e.currentTarget.dataset.startX = touch.clientX;
    e.currentTarget.dataset.startY = touch.clientY;
  }, []);

  const handleTouchEnd = useCallback((e, pageIndex) => {
    const startX = parseFloat(e.currentTarget.dataset.startX);
    const startY = parseFloat(e.currentTarget.dataset.startY);
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    
    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        handleImageNavigation(pageIndex, 'prev');
      } else {
        handleImageNavigation(pageIndex, 'next');
      }
    }
  }, [handleImageNavigation]);

  if (isLoading && currentPage <= 1 && pageData.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-32 h-32 mx-auto mb-6">
          <CircularProgressbar 
            value={progress} 
            text={`${Math.round(progress)}%`}
            styles={{
              path: { stroke: '#0066FF' },
              text: { fill: '#0066FF', fontSize: '16px' }
            }}
          />
        </div>
        <p className="text-4xl text-gray-600">Creating {childName}'s Book...</p>
        
        <div className="mt-12 bg-blue-900 rounded-xl p-8 text-white">
          <p className="italic text-xl mb-4">"This is the best gift one can give to their kids!"</p>
          <p className="font-semibold">SNJ</p>
        </div>
      </div>
    );
  }

  const handleSavePreview = () => {
    // Create query params with all details for save preview page
    const saveParams = new URLSearchParams({
      request_id: request_id,
      book_id: book_id,
      name: childName,
      gender: gender || '',
      age: age || '',
      birthMonth: birthMonth || ''
    });
    
    return `/save-preview?${saveParams.toString()}`;
  };

  const handleUploadAnother = () => {
    // Create query params to go back to upload with all details
    const uploadParams = new URLSearchParams({
      book_id: book_id,
      name: childName,
      gender: gender || '',
      age: age || '',
      birthMonth: birthMonth || ''
    });
    
    return `/upload?${uploadParams.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-gray-50 z-50 shadow-md">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Want to try a different photo?</p>
            <Link 
              to={handleUploadAnother()}
              className="bg-secondary text-white px-6 py-2 rounded-full text-sm hover:bg-blue-600 transition duration-300"
            >
              Upload Another Photo
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 pb-24">
        <h1 className="text-5xl font-bold text-center text-blue-900 mb-6">
          {childName}'s Book Preview
        </h1>

        <div className="space-y-12">
          <div className="text-center space-y-2 font-medium text-gray-600">
            <p className="text-2xl">↓ Pages get shown one below the other</p>
            <p className="text-2xl">🔄 Swipe left/right to see different images</p>
          </div>

          {pageData.map((page, pageIndex) => {
            if (!page) return null;
            
            const images = page.image_urls || [];
            const currentImageIndex = currentImageIndexes[pageIndex] || 0;

            return (
              <div 
                key={pageIndex}
                className="bg-white rounded-xl shadow-lg p-4 sm:p-6 transform transition-all duration-500 ease-in-out"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-blue-900">Page {pageIndex + 1}</h2>
                  {images.length > 1 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{currentImageIndex + 1} of {images.length}</span>
                    </div>
                  )}
                </div>
                
                <div className="relative w-full rounded-lg overflow-hidden group">
                  <div 
                    className="relative"
                    onTouchStart={(e) => handleTouchStart(e, pageIndex)}
                    onTouchEnd={(e) => handleTouchEnd(e, pageIndex)}
                  >
                    <img 
                      src={images[currentImageIndex]}
                      alt={`Page ${pageIndex + 1} - Image ${currentImageIndex + 1}`}
                      className="w-full aspect-[4/3] object-cover transition-opacity duration-300"
                    />
                    
                    {/* Navigation arrows - only show if there are multiple images */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => handleImageNavigation(pageIndex, 'prev')}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full transition-opacity duration-300 hover:bg-opacity-70"
                          aria-label="Previous image"
                        >
                          <ChevronLeftIcon className="h-5 w-5" />
                        </button>
                        
                        <button
                          onClick={() => handleImageNavigation(pageIndex, 'next')}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full transition-opacity duration-300 hover:bg-opacity-70"
                          aria-label="Next image"
                        >
                          <ChevronRightIcon className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Image indicators - only show if there are multiple images */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {images.map((_, imageIndex) => (
                        <button
                          key={imageIndex}
                          onClick={() => setCurrentImageIndexes(prev => ({
                            ...prev,
                            [pageIndex]: imageIndex
                          }))}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            imageIndex === currentImageIndex 
                              ? 'bg-white scale-125' 
                              : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                          }`}
                          aria-label={`Go to image ${imageIndex + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <p className="mt-6 text-gray-800 text-lg font-medium text-center px-4">
                  {page.scene || `Page ${pageIndex + 1} content`}
                </p>

                {/* Swipe instruction for mobile */}
                {images.length > 1 && (
                  <p className="mt-2 text-center text-sm text-gray-500 md:hidden">
                    Swipe left or right to see more images
                  </p>
                )}
              </div>
            );
          })}

          {isLoading && currentPage > 1 && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">{loadingMessage}</p>
              {hasNextPage && <p className="text-sm text-gray-500">Next page coming up...</p>}
            </div>
          )}
        </div>
      </div>

      {(showSaveButton || (!hasNextPage && !isLoading)) && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg transform transition-all duration-300 z-50">
          <div className="max-w-2xl mx-auto">
            <Link
              to={handleSavePreview()}
              className="block w-full bg-secondary text-white text-center py-4 rounded-full text-xl font-semibold hover:bg-blue-600 transition duration-300"
            >
              Save Preview & Show Price
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Preview;