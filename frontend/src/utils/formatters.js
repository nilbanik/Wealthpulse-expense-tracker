export const CURRENCIES = {
  INR: {
    code: 'INR',
    symbol: '₹',
    country: 'India',
    countryCode: 'IN',
    name: 'Indian Rupee',
    rateToInr: 1.0,
    locale: 'en-IN',
    fractionDigits: 2,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    country: 'USA',
    countryCode: 'US',
    name: 'US Dollar',
    rateToInr: 0.0116,
    locale: 'en-US',
    fractionDigits: 2,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    country: 'Europe',
    countryCode: 'EU',
    name: 'Euro',
    rateToInr: 0.0111,
    locale: 'de-DE',
    fractionDigits: 2,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    country: 'UK',
    countryCode: 'GB',
    name: 'British Pound',
    rateToInr: 0.0094,
    locale: 'en-GB',
    fractionDigits: 2,
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    country: 'Japan',
    countryCode: 'JP',
    name: 'Japanese Yen',
    rateToInr: 1.82,
    locale: 'ja-JP',
    fractionDigits: 0,
  },
  KWD: {
    code: 'KWD',
    symbol: 'KD',
    country: 'Kuwait',
    countryCode: 'KW',
    name: 'Kuwaiti Dinar',
    rateToInr: 0.0036,
    locale: 'ar-KW',
    fractionDigits: 3,
  },
  AED: {
    code: 'AED',
    symbol: 'AED',
    country: 'UAE',
    countryCode: 'AE',
    name: 'UAE Dirham',
    rateToInr: 0.0427,
    locale: 'ar-AE',
    fractionDigits: 2,
  },
};

export const formatCurrencyValue = (amountInBaseInr, currencyCode = 'INR') => {
  if (amountInBaseInr === undefined || amountInBaseInr === null) return '₹0.00';
  const curr = CURRENCIES[currencyCode] || CURRENCIES.INR;
  const num = typeof amountInBaseInr === 'string' ? parseFloat(amountInBaseInr) : amountInBaseInr;
  const converted = num * curr.rateToInr;

  try {
    return new Intl.NumberFormat(curr.locale, {
      style: 'currency',
      currency: curr.code,
      maximumFractionDigits: curr.fractionDigits,
      minimumFractionDigits: curr.fractionDigits,
    }).format(converted);
  } catch (e) {
    return `${curr.symbol}${converted.toFixed(curr.fractionDigits)}`;
  }
};

export const formatCurrency = (amount, currencyCode = 'INR') => {
  return formatCurrencyValue(amount, currencyCode);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const CATEGORY_CONFIG = {
  Investments: {
    color: '#10B981',
    bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
    iconName: 'TrendingUp',
  },
  Salary: {
    color: '#EAB308',
    bg: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/25',
    iconName: 'Coins',
  },
  Rent: {
    color: '#3B82F6',
    bg: 'bg-blue-500/10 text-blue-300 border-blue-500/25',
    iconName: 'Building2',
  },
  Food: {
    color: '#F59E0B',
    bg: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
    iconName: 'Utensils',
  },
  Shopping: {
    color: '#F43F5E',
    bg: 'bg-rose-500/10 text-rose-300 border-rose-500/25',
    iconName: 'ShoppingBag',
  },
  Utilities: {
    color: '#06B6D4',
    bg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25',
    iconName: 'Zap',
  },
  Entertainment: {
    color: '#A855F7',
    bg: 'bg-purple-500/10 text-purple-300 border-purple-500/25',
    iconName: 'Film',
  },
  Health: {
    color: '#14B8A6',
    bg: 'bg-teal-500/10 text-teal-300 border-teal-500/25',
    iconName: 'HeartPulse',
  },
  Other: {
    color: '#94A3B8',
    bg: 'bg-slate-500/10 text-slate-300 border-slate-500/25',
    iconName: 'MoreHorizontal',
  },
};

export const PAYMENT_METHODS = [
  'UPI',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'Cash',
];

export const ALL_CATEGORIES = Object.keys(CATEGORY_CONFIG);
