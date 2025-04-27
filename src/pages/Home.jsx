import { useEffect, useState } from "react";
import { getCryptos } from "../services/api";
import CardCrypto from "../components/CardCrypto";

function Home() {
  const [cryptos, setCryptos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cryptosPerPage = 10;

  useEffect(() => {
    getCryptos()
      .then((data) => {
        setCryptos(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const indexOfLastCrypto = currentPage * cryptosPerPage;
  const indexOfFirstCrypto = indexOfLastCrypto - cryptosPerPage;
  const currentCryptos = cryptos.slice(indexOfFirstCrypto, indexOfLastCrypto);

  const totalPages = Math.ceil(cryptos.length / cryptosPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-base text-indigo-700 font-medium">Cargando criptomonedas...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
          <p className="text-red-500 font-semibold mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      {/* Header */}
      <div className="py-6 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700">CryptoTracker</h1>
        <p className="text-gray-500 text-sm mt-1">
          Página {currentPage} de {totalPages} — Mostrando {indexOfFirstCrypto + 1}-{Math.min(indexOfLastCrypto, cryptos.length)} de {cryptos.length} criptomonedas
        </p>
      </div>

      {/* Grid */}
      <main className="flex-grow px-4 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {currentCryptos.length > 0 ? (
            currentCryptos.map((crypto) => (
              <CardCrypto key={crypto.id} crypto={crypto} />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">No hay criptomonedas disponibles.</p>
          )}
        </div>
      </main>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 py-6">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-6 py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold disabled:opacity-50 transition"
        >
          Anterior
        </button>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-6 py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold disabled:opacity-50 transition"
        >
          Siguiente
        </button>
      </div>

    </div>
  );
}

export default Home;