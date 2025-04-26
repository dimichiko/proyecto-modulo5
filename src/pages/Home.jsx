import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../services/api";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPosts()
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-10 text-lg">Cargando...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500 text-lg">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-extrabold text-center text-indigo-700 mb-12">
          Posts recientes
        </h1>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <Link to={`/post/${post.id}`} className="block p-6 h-full">
                <h2 className="text-2xl font-semibold mb-3 text-gray-800 hover:text-indigo-600 leading-snug">
                  {post.title}
                </h2>
                <p className="text-gray-600 text-sm">{post.body.slice(0, 120)}...</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;