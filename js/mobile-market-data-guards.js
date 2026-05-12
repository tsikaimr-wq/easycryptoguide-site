(function (root, factory) {
    const api = factory();
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
    if (root) {
        root.ECMobileMarketDataGuards = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    const LOCAL_ONLY_HOSTS = new Set(['127.0.0.1', 'localhost']);

    function normalizeHost(hostname) {
        return String(hostname || '').trim().toLowerCase();
    }

    function shouldEnableMockMarketData(hostname) {
        return LOCAL_ONLY_HOSTS.has(normalizeHost(hostname));
    }

    function shouldPromoteToMock(allowMockFallback, failureCount, threshold) {
        const limit = Number.isFinite(Number(threshold)) ? Number(threshold) : 3;
        return Boolean(allowMockFallback) && Number(failureCount) >= limit;
    }

    function shouldAllowPublicMarketDataPreview(options) {
        const target = String(options && options.target || '').trim();
        const authOverlayActive = Boolean(options && options.authOverlayActive);
        if (!authOverlayActive) return true;
        return ['homeScreen', 'market', 'trade', 'kline'].includes(target);
    }

    return {
        shouldEnableMockMarketData,
        shouldPromoteToMock,
        shouldAllowPublicMarketDataPreview
    };
});
