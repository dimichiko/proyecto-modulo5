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
    setLoading(true);
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
      // Scroll to top smoothly when changing pages
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      // Scroll to top smoothly when changing pages
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-blue-100 overflow-hidden">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-lg font-medium text-indigo-700">Cargando criptomonedas...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-blue-100 overflow-hidden">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
          <p className="text-red-500 text-lg font-medium">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-indigo-50 to-blue-100 overflow-hidden">
      {/* Header */}
      <header className="pt-6 pb-4 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-indigo-700">
            Crypto<span className="text-indigo-500">Tracker</span>
          </h1>
          <p className="text-center text-gray-600 mt-2">
            {`Página ${currentPage} de ${totalPages} • Mostrando ${indexOfFirstCrypto + 1}-${Math.min(indexOfLastCrypto, cryptos.length)} de ${cryptos.length} criptomonedas`}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full">
          {currentCryptos.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-center text-lg bg-white p-8 rounded-xl shadow-md">
                No hay criptomonedas disponibles.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {currentCryptos.map((crypto) => (
                <CardCrypto key={crypto.id} crypto={crypto} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Pagination Footer */}
      <footer className="py-4 px-4 mt-auto">
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-6 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Anterior
          </button>
          
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-6 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
          >
            Siguiente
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
}

export default Home;