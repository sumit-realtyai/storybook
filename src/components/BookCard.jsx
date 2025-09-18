import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function BookCard({ book }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  
  const images = [book.animatedImage, book.secondaryImage];
  const navigate = useNavigate();
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

  const openForm = (bookId) => {
      navigate(`/details?book_id=${bookId}&page_count=${book.page_count}&min_photos=${book.min_required_photos}`);
  }
// {
//     "_id": "6818cab3bfb946189a94960c",
//     "title": "The Adventures of Luna",
//     "description": "A magical journey of a young girl who discovers a world beyond the stars.",
//     "cover_photo": "https://example.com/images/luna-cover.jpg",
//     "page_count": 6,
//     "age_group": "2-5",
//     "min_required_photos": 2,
//     "source": "imagitime",
//     "author": "Jane Doe",
//     "created_at": "2025-05-05T14:26:59.953Z",
//     "__v": 0
// }

// {
//     id: 1,
//     title: "Little Child's Big Steps",
//     description: "Your child joins adorable animal friends in teaching important milestones! A great keepsake of your little one's growth.",
//     ageRange: "0 to 1",
//     image: "https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&w=1800",
//     secondaryImage: "https://images.pexels.com/photos/3662632/pexels-photo-3662632.jpeg?auto=compress&cs=tinysrgb&w=1800",
//     animatedImage: "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=1800",
//     theme: "water",
//     companion: "duck"
//   },
  return (
    <div className="flex flex-col md:flex-row overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-r from-blue-600 to-blue-800">
      <div className={`relative w-full md:w-3/5 h-[300px] md:h-[600px] perspective-1000 ${isFlipping ? 'animate-flip' : ''}`}>
        {/* {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${book.title} ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 backface-hidden
              ${currentImageIndex === index ? 'opacity-100 rotate-y-0' : 'opacity-0 rotate-y-180'}`}
          />
        ))} */}

          <img
            
            src={book.cover_photo}
            alt={`${book.title} `}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 backface-hidden`}
          />
      </div>

      <div className="w-full md:w-2/5 p-6 md:p-10 flex flex-col justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <div className="mb-4 md:mb-6">
          <span className="inline-block px-4 md:px-6 py-1 md:py-2 bg-yellow-400 text-blue-900 rounded-full text-base md:text-lg font-bold">
            Ages {book.age_group}
          </span>
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6">{book.title}</h2>
        <p className="text-blue-100 mb-6 md:mb-10 text-base md:text-xl leading-relaxed">{book.description}</p>
        <button
          // to="/details"
          onClick={() => openForm(book._id)}
          className="bg-white text-blue-600 text-center py-3 md:py-5 px-6 md:px-10 rounded-full text-lg md:text-2xl font-bold 
            transform transition-all duration-300 hover:scale-105 hover:shadow-lg
            hover:bg-yellow-400 hover:text-blue-900"
        >
          Personalize This Book
        </button>
      </div>
    </div>
  );
}

export default BookCard;