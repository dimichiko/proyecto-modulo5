import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import CryptoDetail from "./pages/CryptoDetail";
import ErrorBoundary from './components/ErrorBoundary'; // if you have this component

function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Control scroll-to-top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        {/* Global Header */}
        <header className="bg-gradient-to-r from-indigo-700 to-indigo-900 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="rounded-full bg-white/20 p-2">
                <svg 
                  className="w-6 h-6" 
                  fill="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z" />
                </svg>
              </div>
              <span className="font-bold text-xl">CryptoTracker</span>
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Link to="/" className="hover:text-indigo-200 transition-colors">
                Inicio
              </Link>
              <a 
                href="https://www.coingecko.com/api/documentation" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-indigo-200 transition-colors"
              >
                API Docs
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/crypto/:id" element={<CryptoDetail />} />
              <Route path="*" element={
                <div className="h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-blue-100">
                  <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                    <h1 className="text-3xl font-bold text-indigo-700 mb-4">Página no encontrada</h1>
                    <p className="text-gray-600 mb-6">La página que buscas no existe o ha sido movida.</p>
                    <Link to="/" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      Volver al inicio
                    </Link>
                  </div>
                </div>
              } />
            </Routes>
          </ErrorBoundary>
        </main>
        
        {/* Scroll to top button */}
        {showScrollTop && (
          <button 
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all z-50"
            aria-label="Scroll to top"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
          </button>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;