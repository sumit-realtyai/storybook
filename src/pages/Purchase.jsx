import { Link } from 'react-router-dom';
import useChildStore from '../store/childStore';

function Purchase() {
  const childName = useChildStore((state) => state.childName);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">
          {childName}'s Personalized Storybook
        </h1>

        <div className="bg-blue-50 p-4 rounded-xl mb-8">
          <div className="flex items-center gap-2 text-red-500 mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">Printing & delivery takes 6 to 10 days, so please order accordingly</p>
          </div>
          <p className="text-center text-gray-600">Once you order, you can still make changes for 12 hours.</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm flex items-center gap-1">
              <span>⭐</span> Popular Choice <span>⭐</span>
            </div>
            <button className="w-full bg-secondary text-white py-4 rounded-xl text-xl font-bold hover:bg-blue-600 transition duration-300">
              Buy Hardcover ₹2200
            </button>
          </div>

          <button className="w-full bg-secondary text-white py-4 rounded-xl text-xl font-bold hover:bg-blue-600 transition duration-300">
            Buy Paperback ₹1650
          </button>
        </div>

        <div className="text-center text-gray-600 italic mb-8">
          <p>Free shipping anywhere in India</p>
          <p className="text-red-500">Delivery in 6 to 10 days</p>
        </div>

        <div className="flex justify-center gap-6 mb-8">
          <img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png" alt="PayPal" className="h-8" />
          <img src="https://cdn.razorpay.com/logo.svg" alt="Razorpay" className="h-8" />
          <img src="https://www.apple.com/v/apple-pay/i/images/overview/og_image.png?202311160446" alt="Apple Pay" className="h-8" />
          <img src="https://usa.visa.com/dam/VCOM/regional/ve/romania/blogs/hero-image/visa-logo-800x450.jpg" alt="Visa" className="h-8" />
          <img src="https://brand.mastercard.com/content/dam/mccom/brandcenter/thumbnails/mastercard_vrt_rev_92px_2x.png" alt="Mastercard" className="h-8" />
        </div>

        <Link
          to="/preview"
          className="block w-full bg-gray-100 text-center py-3 rounded-xl text-lg font-medium hover:bg-gray-200 transition duration-300"
        >
          ← Go Back To Preview
        </Link>
      </div>
    </div>
  );
}

export default Purchase;