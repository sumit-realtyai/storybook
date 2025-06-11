import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useChildStore from '../store/childStore';

function SavePreview() {
  const navigate = useNavigate();
  const childName = useChildStore((state) => state.childName);
  const [formData, setFormData] = useState({
    email: '',
    name: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/purchase');
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-2">
          Email {childName}'s preview link & show price of printed book
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div>
            <label className="block text-gray-700 text-lg mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-2">We'll email you the preview link.</p>
            <input
              type="email"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-lg mb-2">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your name"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-secondary text-white py-4 px-6 rounded-full text-xl font-semibold hover:bg-blue-600 transition duration-300"
          >
            Save Preview & Show Price
          </button>
        </form>

        <div className="mt-12 text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-2">Rated 4.9 out of 5</h2>
          <p className="text-gray-600">Based on verified reviews on Yotpo.</p>
        </div>
      </div>
    </div>
  );
}

export default SavePreview;