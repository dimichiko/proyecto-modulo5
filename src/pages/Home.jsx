import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../services/api';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPosts()
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-10">Posts recientes</h1>
        <div className="grid gap-8 md:grid-cols-2">
          {posts.map(post => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-300">
              <Link to={`/post/${post.id}`}>
                <h2 className="text-2xl font-bold mb-2 text-gray-800 hover:text-indigo-600">{post.title}</h2>
              </Link>
              <p className="text-gray-600">{post.body.slice(0, 100)}...</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;