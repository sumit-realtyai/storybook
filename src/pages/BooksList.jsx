import BookCard from '../components/BookCard';

const books = [
  {
    id: 1,
    title: "Little Child's Big Steps",
    description: "Your child joins adorable animal friends in teaching important milestones! A great keepsake of your little one's growth.",
    ageRange: "0 to 1",
    image: "https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&w=1800",
    secondaryImage: "https://images.pexels.com/photos/3662632/pexels-photo-3662632.jpeg?auto=compress&cs=tinysrgb&w=1800",
    animatedImage: "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=1800",
    theme: "water",
    companion: "duck"
  },
  {
    id: 2,
    title: "Dinosaur Adventure",
    description: "Join your child on an exciting journey with friendly dinosaurs, where imagination and bravery lead to amazing discoveries!",
    ageRange: "2 to 4",
    image: "https://images.pexels.com/photos/4503751/pexels-photo-4503751.jpeg?auto=compress&cs=tinysrgb&w=1800",
    secondaryImage: "https://images.pexels.com/photos/4503815/pexels-photo-4503815.jpeg?auto=compress&cs=tinysrgb&w=1800",
    animatedImage: "https://images.pexels.com/photos/8533225/pexels-photo-8533225.jpeg?auto=compress&cs=tinysrgb&w=1800",
    theme: "adventure",
    companion: "t-rex"
  },
  {
    id: 3,
    title: "Doctor for a Day",
    description: "Your child becomes a caring doctor, helping their teddy bear friend feel better with love and kindness!",
    ageRange: "3 to 6",
    image: "https://images.pexels.com/photos/3662579/pexels-photo-3662579.jpeg?auto=compress&cs=tinysrgb&w=1800",
    secondaryImage: "https://images.pexels.com/photos/3662625/pexels-photo-3662625.jpeg?auto=compress&cs=tinysrgb&w=1800",
    animatedImage: "https://images.pexels.com/photos/8533391/pexels-photo-8533391.jpeg?auto=compress&cs=tinysrgb&w=1800",
    theme: "medical",
    companion: "teddy"
  }
];

function BooksList() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <h1 className="text-5xl font-bold text-center mb-4 text-blue-900">Books for Kids</h1>
      <p className="text-2xl text-blue-800 text-center mb-12">Choose a magical story for your little one</p>

      <div className="max-w-5xl mx-auto space-y-24">
        {books.map((book) => (
          <div key={book.id} className="transform hover:scale-105 transition-transform duration-300">
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default BooksList;