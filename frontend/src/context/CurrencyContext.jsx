import React, { createContext, useContext, useState, useEffect } from 'react';
import { CURRENCIES, formatCurrencyValue } from '../utils/formatters';

const CurrencyContext = createContext(null);

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem('wealthpulse_currency') || 'INR';
  });

  const setCurrency = (code) => {
    if (CURRENCIES[code]) {
      setCurrencyState(code);
      localStorage.setItem('wealthpulse_currency', code);
    }
  };

  const currentCurrencyInfo = CURRENCIES[currency] || CURRENCIES.INR;

  const formatAmount = (amountInInr) => {
    return formatCurrencyValue(amountInInr, currency);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        currencies: CURRENCIES,
        currentCurrencyInfo,
        formatAmount,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
