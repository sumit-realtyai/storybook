import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function BookCard({ book }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  
  const images = [book.animatedImage, book.secondaryImage];

  useEffect(() => {
    const timer = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? 1 : 0));
        setIsFlipping(false);
      }, 500);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col md:flex-row overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-r from-blue-600 to-blue-800">
      <div className={`relative w-full md:w-3/5 h-[300px] md:h-[600px] perspective-1000 ${isFlipping ? 'animate-flip' : ''}`}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${book.title} ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 backface-hidden
              ${currentImageIndex === index ? 'opacity-100 rotate-y-0' : 'opacity-0 rotate-y-180'}`}
          />
        ))}
      </div>

      <div className="w-full md:w-2/5 p-6 md:p-10 flex flex-col justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <div className="mb-4 md:mb-6">
          <span className="inline-block px-4 md:px-6 py-1 md:py-2 bg-yellow-400 text-blue-900 rounded-full text-base md:text-lg font-bold">
            Ages {book.ageRange}
          </span>
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6">{book.title}</h2>
        <p className="text-blue-100 mb-6 md:mb-10 text-base md:text-xl leading-relaxed">{book.description}</p>
        <Link
          to="/details"
          className="bg-white text-blue-600 text-center py-3 md:py-5 px-6 md:px-10 rounded-full text-lg md:text-2xl font-bold 
            transform transition-all duration-300 hover:scale-105 hover:shadow-lg
            hover:bg-yellow-400 hover:text-blue-900"
        >
          Personalize This Book
        </Link>
      </div>
    </div>
  );
}

export default BookCard;