import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PriceChart = ({ data = [], ticker = 'AAPL' }) => {
  // Generate mock data if none provided
  const mockData = data.length > 0 ? data : Array.from({ length: 20 }, (_, i) => ({
    time: `${i}:00`,
    price: 150 + Math.random() * 10 - 5,
    volume: Math.floor(Math.random() * 1000000)
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis 
            dataKey="time" 
            stroke="#a0a0a0"
            fontSize={12}
          />
          <YAxis 
            stroke="#a0a0a0"
            fontSize={12}
            domain={['dataMin - 1', 'dataMax + 1']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: '8px',
              color: '#ffffff'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#00ff88" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#00ff88' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart; 