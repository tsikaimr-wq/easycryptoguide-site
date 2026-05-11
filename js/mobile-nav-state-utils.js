(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
    return;
  }
  root.ECMobileNavStateUtils = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const SUPPORT_FOOTER_SCREENS = new Set(['supportScreen', 'supportChatScreen']);
  const PREVIEW_NAV_SCREENS = new Set([
    'homeScreen',
    'market',
    'trade',
    'funds',
    'deposit',
    'withdraw',
    'history',
    'flash-history',
    'order-detail',
    'announcement-details',
    'profile',
    'safe',
    'payment-method',
    'consume-record',
    'certification-center',
    'advanced-certification',
    'kyc-submitted',
    'helpCenterScreen',
    'questionDetailsScreen',
    'aboutUsScreen',
    'privacyPolicyScreen',
    'termsOfServiceScreen',
    'fais',
    'kline',
  ]);

  function normalizeScreenName(value) {
    return String(value || '').trim();
  }

  function shouldShowMobileBottomNav(options = {}) {
    const currentScreen = normalizeScreenName(options.currentScreen);
    const appOpen = options.appOpen === true;
    const authVisible = options.authVisible === true;

    if (SUPPORT_FOOTER_SCREENS.has(currentScreen)) return false;
    if (appOpen) return true;
    if (PREVIEW_NAV_SCREENS.has(currentScreen)) return true;
    return !authVisible;
  }

  return {
    shouldShowMobileBottomNav,
  };
}));
