import { Link } from 'react-router-dom';
import {useEffect} from 'react';
import axios from 'axios';
function BookSelection() {

useEffect(() => {
  const createUser = async () => {
    try {
        const response =await axios.post('http://localhost:3000/api/photo/add_photo_to_queue', {
    file_name: "realty_ai_logo.jpg",
file_url: 
"https://kids-storybooks.s3.ap-south-1.amazonaws.com/original_images/1747054504416_realty_ai_logo.jpg",
request_id
: 
"req_t4y68jo0r"
});
        console.log('User created:', response.data);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };
  createUser();
}, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Welcome to Imagitime
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create personalized storybooks that make your child the star of their own adventure!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition duration-300">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Create a Custom Book</h2>
              <p className="text-gray-600 mb-6">
                Make your child the hero of their own story with our personalized books.
              </p>
              <Link
                to="/books"
                className="inline-block bg-secondary text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600 transition duration-300"
              >
                Start Creating
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition duration-300">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">View Sample Books</h2>
              <p className="text-gray-600 mb-6">
                Explore our collection of beautifully crafted children's books.
              </p>
              <Link
                to="/books"
                className="inline-block bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition duration-300"
              >
                Browse Books
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Imagitime?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h4 className="text-xl font-semibold mb-2">Personalized Stories</h4>
              <p className="text-gray-600">Every book is uniquely crafted for your child</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h4 className="text-xl font-semibold mb-2">Quick Creation</h4>
              <p className="text-gray-600">Create your book in minutes</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h4 className="text-xl font-semibold mb-2">Quality Guaranteed</h4>
              <p className="text-gray-600">Premium printing and materials</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookSelection;