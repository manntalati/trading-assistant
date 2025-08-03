import React from 'react';
import { useTrading } from '../context/TradingContext';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MarketOverview = () => {
  const { state } = useTrading();

  const getPriceChangeIcon = (changePercent) => {
    const change = parseFloat(changePercent);
    if (change > 0) return <TrendingUp className="w-4 h-4 text-bullish" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-bearish" />;
    return <Minus className="w-4 h-4 text-neutral" />;
  };

  const getPriceChangeColor = (changePercent) => {
    const change = parseFloat(changePercent);
    if (change > 0) return 'text-bullish';
    if (change < 0) return 'text-bearish';
    return 'text-neutral';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Symbol</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Price</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Change</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">% Change</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Volume</th>
          </tr>
        </thead>
        <tbody>
          {state.watchlist.map((ticker) => {
            const priceData = state.latestPrices[ticker];
            if (!priceData) return null;

            return (
              <tr key={ticker} className="border-b border-gray-700/50 hover:bg-gray-800/20 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-medium text-white">{ticker}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="font-mono text-white">${priceData.price}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    {getPriceChangeIcon(priceData.changePercent)}
                    <span className={`font-mono ${getPriceChangeColor(priceData.changePercent)}`}>
                      {parseFloat(priceData.change) > 0 ? '+' : ''}{priceData.change}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`font-mono ${getPriceChangeColor(priceData.changePercent)}`}>
                    {parseFloat(priceData.changePercent) > 0 ? '+' : ''}{priceData.changePercent}%
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="font-mono text-gray-400">
                    {priceData.volume.toLocaleString()}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {state.watchlist.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No market data available</p>
        </div>
      )}
    </div>
  );
};

export default MarketOverview; 