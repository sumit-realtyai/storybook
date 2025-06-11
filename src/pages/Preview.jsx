import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CircularProgressbar } from 'react-circular-progressbar';
import { useSwipeable } from 'react-swipeable';
import 'react-circular-progressbar/dist/styles.css';
import useChildStore from '../store/childStore';
import axios from 'axios';

function Preview() {
  const [searchParams] = useSearchParams();
  const request_id = searchParams.get('request_id');
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageData, setPageData] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [hasNextPage, setHasNextPage] = useState(true);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const childName = useChildStore((state) => state.childName);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowSaveButton(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchPageData = useCallback(async (pageNumber) => {
    try {
      // http://localhost:5000/api/photo/get_generation_details
      // https://is510t1jgd.execute-api.ap-south-1.amazonaws.com/api/photo/get_generation_details
      const response = await axios.get(`http://localhost:5000/api/photo/get_generation_details`, {
        params: {
          req_id: request_id,
          book_id: 1,
          page_number: pageNumber
        },
        
      });
      const data = response.data;
      return { ...data, pageNumber };
    } catch (error) {
      console.error('Error fetching page data:', error);
      return null;
    }
  }, [request_id]);

  useEffect(() => {
    let progressInterval;
    let isMounted = true;

    const loadPage = async () => {
      if (currentPage <= 4) {
        progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              return 100;
            }
            return prev + 2;
          });
        }, 100);
      } else {
        setLoadingMessage(`Loading page ${currentPage}`);
      }

      const pageResult = await fetchPageData(currentPage);
      
      if (!isMounted) return;

      if (pageResult) {
        setPageData(prev => {
          const newPages = [...prev];
          newPages[pageResult.pageNumber - 1] = pageResult;
          return newPages;
        });
        
        if (progressInterval) {
          clearInterval(progressInterval);
        }
        
        setIsLoading(false);
        setHasNextPage(pageResult.next || false);

        if (pageResult.next) {
          setCurrentPage(prev => prev + 1);
          setIsLoading(true);
          if (currentPage > 4) {
            setLoadingMessage(`Loading page ${currentPage + 1}`);
          }
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
  }, [currentPage, fetchPageData]);

  

  if (isLoading && currentPage <= 4 && pageData.length === 0) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-gray-50 z-50 shadow-md">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Want to try a different photo?</p>
            <Link 
              to="/upload" 
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
            <p className="text-2xl">🔄 Swipe left for next page</p>
          </div>

          {pageData.map((page, index) => (
            page && (
              <div 
                key={index}
                
                className="bg-white rounded-xl shadow-lg p-4 sm:p-6 transform transition-all duration-500 ease-in-out"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-blue-900">Page {index + 1}</h2>
                </div>
                
                <div className="relative w-full rounded-lg overflow-hidden">
                  <img 
                    src={page.image_url}
                    alt={`Page ${index + 1}`}
                    className="w-full aspect-[4/3] object-cover"
                    loading="lazy"
                  />
                </div>

                <p className="mt-6 text-gray-800 text-lg font-medium text-center px-4">
                  {page.description || `Page ${index + 1} content`}
                </p>
              </div>
            )
          ))}

          {isLoading && currentPage > 4 && (
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
              to="/save-preview"
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