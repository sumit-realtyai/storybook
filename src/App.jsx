import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BookSelection from './pages/BookSelection';
import BooksList from './pages/BooksList';
import ChildDetails from './pages/ChildDetails';
import PhotoUpload from './pages/PhotoUpload';
import Preview from './pages/Preview';
import SavePreview from './pages/SavePreview';
import Purchase from './pages/Purchase';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<BookSelection />} />
            <Route path="/books" element={<BooksList />} />
            <Route path="/details" element={<ChildDetails />} />
            <Route path="/upload" element={<PhotoUpload />} />
            <Route path="/preview" element={<Preview />} />
            <Route path="/save-preview" element={<SavePreview />} />
            <Route path="/purchase" element={<Purchase />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;