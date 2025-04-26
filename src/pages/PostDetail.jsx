import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching post");
        }
        return response.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center mt-10 text-lg">Cargando post...</p>;
  if (error) return <p className="text-center mt-10 text-red-500 text-lg">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-3xl w-full">
        <h1 className="text-4xl font-bold text-indigo-700 mb-6 leading-tight">
          {post.title}
        </h1>
        <p className="text-gray-700 text-lg leading-relaxed">{post.body}</p>

        <div className="mt-8">
          <Link
            to="/"
            className="inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            ← Volver a Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;