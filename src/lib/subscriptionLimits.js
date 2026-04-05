export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free Plan',
    dailyMatches: 50,
    weeklyContacts: 0,
    canDownloadPdf: false,
    needsPaymentToUnlock: true
  },
  SILVER: {
    name: 'Silver Shivbandhan',
    dailyMatches: Infinity,
    weeklyContacts: 7,
    canDownloadPdf: true,
    needsPaymentToUnlock: false
  },
  GOLD: {
    name: 'Gold Plan',
    dailyMatches: Infinity,
    weeklyContacts: 10,
    canDownloadPdf: true,
    needsPaymentToUnlock: false
  },
  PREMIUM: {
    name: 'Premium Plan',
    dailyMatches: Infinity,
    weeklyContacts: 10,
    canDownloadPdf: true,
    needsPaymentToUnlock: false
  },
  VIP: {
    name: 'Shivbandhan VIP Jodidar',
    dailyMatches: Infinity,
    weeklyContacts: Infinity,
    canDownloadPdf: true,
    needsPaymentToUnlock: false
  }
};

export const getPlanLimits = (planName) => {
  const normName = planName?.toUpperCase() || 'FREE';
  return SUBSCRIPTION_PLANS[normName] || SUBSCRIPTION_PLANS.FREE;
};
