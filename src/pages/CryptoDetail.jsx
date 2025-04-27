import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function CryptoDetail() {
  const { id } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(1); // 1 día por defecto
  const [error, setError] = useState(null);
  const [cryptoData, setCryptoData] = useState(null);

  // Fetch crypto details
  useEffect(() => {
    async function fetchCryptoDetails() {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
        );
        if (!response.ok) {
          throw new Error("Error fetching crypto details");
        }
        const data = await response.json();
        setCryptoData(data);
      } catch (error) {
        setError(error.message);
      }
    }
    fetchCryptoDetails();
  }, [id]);

  // Fetch price history
  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`
        );
        if (!response.ok) {
          throw new Error("Error fetching history");
        }
        const data = await response.json();
        const formattedData = data.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleDateString('es-ES', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          price,
          timestamp,
        }));
        setHistory(formattedData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }
    fetchHistory();
  }, [id, days]);

  const formatTimeLabel = (days) => {
    switch (days) {
      case 1: return "24 horas";
      case 7: return "7 días";
      case 30: return "30 días";
      case 365: return "1 año";
      default: return `${days} días`;
    }
  };

  const formatTooltipValue = (value) => {
    return `$${value.toFixed(2)}`;
  };

  const formatYAxis = (value) => {
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
    return `$${value.toFixed(1)}`;
  };

  if (loading && !cryptoData) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-blue-100 overflow-hidden">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-lg font-medium text-indigo-700">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-blue-100 overflow-hidden">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
          <p className="text-red-500 text-lg font-medium">Error: {error}</p>
          <div className="mt-4 flex justify-between">
            <Link to="/" className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
              Volver al inicio
            </Link>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-indigo-50 to-blue-100 overflow-hidden">
      {/* Header with back button and crypto info */}
      <header className="pt-4 pb-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Link to="/" className="mr-4 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all">
              <svg className="w-5 h-5 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </Link>
            {cryptoData && (
              <div className="flex items-center">
                <img src={cryptoData.image?.thumb} alt={cryptoData.name} className="w-8 h-8 mr-2" />
                <div>
                  <h1 className="text-2xl font-bold text-indigo-700">{cryptoData.name}</h1>
                  <p className="text-gray-600 text-sm">{cryptoData.symbol?.toUpperCase()}</p>
                </div>
              </div>
            )}
          </div>
          
          {cryptoData && cryptoData.market_data && (
            <div className="bg-white rounded-xl shadow-md p-3 flex items-center space-x-4">
              <div className="text-center">
                <p className="text-xs text-gray-500">Precio actual</p>
                <p className="font-bold text-gray-800">${cryptoData.market_data.current_price?.usd.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Cambio 24h</p>
                <p className={`font-bold ${cryptoData.market_data.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {cryptoData.market_data.price_change_percentage_24h?.toFixed(2)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Cap. mercado</p>
                <p className="font-bold text-gray-800">${(cryptoData.market_data.market_cap?.usd / 1000000000).toFixed(2)}B</p>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main content with chart */}
      <main className="flex-grow px-4 pb-4 overflow-hidden">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-4 h-full flex flex-col">
          {/* Time period selector */}
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Historial de precios - {formatTimeLabel(days)}
            </h2>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${days === 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                onClick={() => setDays(1)}
              >
                1D
              </button>
              <button
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${days === 7 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                onClick={() => setDays(7)}
              >
                7D
              </button>
              <button
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${days === 30 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                onClick={() => setDays(30)}
              >
                1M
              </button>
              <button
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${days === 365 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                onClick={() => setDays(365)}
              >
                1A
              </button>
            </div>
          </div>

          {/* Chart */}
          <div className="flex-grow">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }} 
                    tickCount={5} 
                    minTickGap={15}
                  />
                  <YAxis 
                    dataKey="price" 
                    domain={["auto", "auto"]} 
                    tick={{ fontSize: 12 }}
                    tickFormatter={formatYAxis}
                  />
                  <Tooltip 
                    formatter={formatTooltipValue}
                    contentStyle={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid #e2e8f0",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, stroke: "#4338ca", strokeWidth: 1 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500 text-lg">No hay datos disponibles</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default CryptoDetail;