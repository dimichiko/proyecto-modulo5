import { Link } from "react-router-dom";

function CardCrypto({ crypto }) {
  const priceChangeIsPositive = crypto.price_change_percentage_24h >= 0;
  
  return (
    <Link to={`/crypto/${crypto.id}`} className="block h-full">
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 p-4 h-full flex flex-col">
        <div className="flex items-center mb-3">
          <img
            src={crypto.image}
            alt={crypto.name}
            className="w-8 h-8 object-contain"
          />
          <h2 className="text-base font-bold text-gray-800 ml-2 truncate">
            {crypto.name}
          </h2>
        </div>

        <div className="flex-grow flex flex-col justify-between">
          <div className="text-center">
            <p className="text-gray-700 font-semibold">
              ${Number(crypto.current_price).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8
              })}
            </p>
          </div>
          
          <div className={`mt-2 flex items-center justify-center ${priceChangeIsPositive ? 'bg-green-50' : 'bg-red-50'} rounded-lg py-1`}>
            <span className={`flex items-center text-xs font-medium ${priceChangeIsPositive ? 'text-green-600' : 'text-red-600'}`}>
              {priceChangeIsPositive ? (
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                </svg>
              ) : (
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              )}
              {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
            </span>
          </div>
        </div>
        
        <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-center text-gray-500">
          Toca para ver detalles
        </div>
      </div>
    </Link>
  );
}

export default CardCrypto;