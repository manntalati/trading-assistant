import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const TradingContext = createContext();

const initialState = {
  // Market data
  watchlist: ['DE', 'APPL', 'AMD', 'DELL', 'FIG', 'UBER', 'MRVL', 'CSCO', 'VICI', 'PUBM', 'AVD', 'PDSB', 'QQQ', 'VOO'],
  marketData: {},
  latestPrices: {},
  
  // Trading signals
  signals: [],
  aiInsights: [],
  
  // System status
  systemStatus: {
    dataIngestion: 'idle',
    aiAgent: 'idle',
    voiceService: 'idle',
    lastUpdate: null
  },
  
  // User preferences
  preferences: {
    autoRefresh: true,
    notifications: true,
    theme: 'dark'
  },
  
  // Voice assistant
  voiceTranscript: '',
  voiceResponse: '',
  isListening: false
};

function tradingReducer(state, action) {
  switch (action.type) {
    case 'SET_MARKET_DATA':
      return {
        ...state,
        marketData: { ...state.marketData, ...action.payload }
      };
      
    case 'SET_LATEST_PRICES':
      return {
        ...state,
        latestPrices: { ...state.latestPrices, ...action.payload }
      };
      
    case 'ADD_SIGNAL':
      return {
        ...state,
        signals: [action.payload, ...state.signals.slice(0, 49)] // Keep last 50
      };
      
    case 'ADD_AI_INSIGHT':
      return {
        ...state,
        aiInsights: [action.payload, ...state.aiInsights.slice(0, 19)] // Keep last 20
      };
      
    case 'UPDATE_SYSTEM_STATUS':
      return {
        ...state,
        systemStatus: {
          ...state.systemStatus,
          ...action.payload,
          lastUpdate: new Date().toISOString()
        }
      };
      
    case 'SET_VOICE_TRANSCRIPT':
      return {
        ...state,
        voiceTranscript: action.payload
      };
      
    case 'SET_VOICE_RESPONSE':
      return {
        ...state,
        voiceResponse: action.payload
      };
      
    case 'SET_LISTENING':
      return {
        ...state,
        isListening: action.payload
      };
      
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      };
      
    default:
      return state;
  }
}

export function TradingProvider({ children }) {
  const [state, dispatch] = useReducer(tradingReducer, initialState);

  // Fetch market data periodically
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // Fetch from your backend API
        const response = await axios.get('/api/market-data');
        dispatch({ type: 'SET_MARKET_DATA', payload: response.data });
      } catch (error) {
        console.error('Failed to fetch market data:', error);
      }
    };

    // Initial fetch
    fetchMarketData();

    // Set up interval for auto-refresh
    if (state.preferences.autoRefresh) {
      const interval = setInterval(fetchMarketData, 30000); // 30 seconds
      return () => clearInterval(interval);
    }
  }, [state.preferences.autoRefresh]);

  // Fetch system status
  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        const response = await axios.get('/api/system-status');
        dispatch({ type: 'UPDATE_SYSTEM_STATUS', payload: response.data });
      } catch (error) {
        console.error('Failed to fetch system status:', error);
      }
    };

    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Mock data for development
  useEffect(() => {
    // Simulate real-time price updates
    const mockPriceUpdates = setInterval(() => {
      const mockPrices = {};
      state.watchlist.forEach(ticker => {
        const currentPrice = 100 + Math.random() * 200;
        const change = (Math.random() - 0.5) * 10;
        mockPrices[ticker] = {
          price: currentPrice.toFixed(2),
          change: change.toFixed(2),
          changePercent: ((change / currentPrice) * 100).toFixed(2),
          volume: Math.floor(Math.random() * 1000000)
        };
      });
      dispatch({ type: 'SET_LATEST_PRICES', payload: mockPrices });
    }, 5000);

    return () => clearInterval(mockPriceUpdates);
  }, [state.watchlist]);

  const value = {
    state,
    dispatch,
    actions: {
      addSignal: (signal) => dispatch({ type: 'ADD_SIGNAL', payload: signal }),
      addInsight: (insight) => dispatch({ type: 'ADD_AI_INSIGHT', payload: insight }),
      setVoiceTranscript: (transcript) => dispatch({ type: 'SET_VOICE_TRANSCRIPT', payload: transcript }),
      setVoiceResponse: (response) => dispatch({ type: 'SET_VOICE_RESPONSE', payload: response }),
      setListening: (isListening) => dispatch({ type: 'SET_LISTENING', payload: isListening }),
      updatePreferences: (preferences) => dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences })
    }
  };

  return (
    <TradingContext.Provider value={value}>
      {children}
    </TradingContext.Provider>
  );
}

export function useTrading() {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
} 