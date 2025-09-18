import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useChildStore from '../store/childStore';
import { UserCircleIcon, CalendarIcon, CakeIcon } from '@heroicons/react/24/outline';

function ChildDetails() {
  const navigate = useNavigate();
  const setChildName = useChildStore((state) => state.setChildName);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    age: '',
    birthMonth: ''
  });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const book_id = queryParams.get('book_id');
  const page_count = queryParams.get('page_count');
  const min_photos = queryParams.get('min_photos');

  const handleSubmit = (e) => {
    e.preventDefault();
    setChildName(formData.name);
    
    // Create query params with all child details and book_id
    const uploadParams = new URLSearchParams({
      book_id: book_id,
      name: formData.name,
      gender: formData.gender,
      age: formData.age,
      birthMonth: formData.birthMonth,
      page_count: page_count,
      min_photos: min_photos

    });
    
    navigate(`/upload?${uploadParams.toString()}`);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <div className="flex justify-center mb-6">
          <UserCircleIcon className="h-16 w-16 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Tell us about your little star!
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-lg mb-2">
              Child's First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition duration-300"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Enter child's name"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-lg mb-2">Gender</label>
            <div className="flex gap-6">
              {['Boy', 'Girl'].map((gender) => (
                <label key={gender} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={gender.toLowerCase()}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="text-gray-700">{gender}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="relative">
            <label className="block text-gray-700 text-lg mb-2">Current Age</label>
            <div className="relative">
              <select
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition duration-300 appearance-none"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              >
                <option value="">Select Age</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={i}>{i} years</option>
                ))}
              </select>
              <CakeIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          <div className="relative">
            <label className="block text-gray-700 text-lg mb-2">Birth Month</label>
            <div className="relative">
              <select
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition duration-300 appearance-none"
                value={formData.birthMonth}
                onChange={(e) => setFormData({ ...formData, birthMonth: e.target.value })}
              >
                <option value="">Select Month</option>
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <CalendarIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-secondary text-white py-4 px-6 rounded-full text-lg font-semibold hover:bg-blue-600 transition duration-300 mt-8"
          >
            Next Step → Upload Photos
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChildDetails;