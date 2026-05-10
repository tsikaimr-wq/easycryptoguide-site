(function (globalScope) {
    function formatDepositImportantText(coin, chain) {
        var normalizedCoin = String(coin || 'USDT').trim().toUpperCase() || 'USDT';
        var normalizedChain = String(chain || 'TRC20').trim().toUpperCase() || 'TRC20';
        return 'Do not deposit any non-' + normalizedCoin + '-' + normalizedChain + ' assets to the address above. Unsupported deposits may not be recoverable.';
    }

    function getDataUrlByteSize(dataUrl) {
        if (!dataUrl || typeof dataUrl !== 'string') return 0;
        var parts = dataUrl.split(',');
        if (parts.length < 2) return 0;
        var base64 = parts[1].replace(/\s/g, '');
        if (!base64) return 0;
        var padding = 0;
        if (base64.endsWith('==')) padding = 2;
        else if (base64.endsWith('=')) padding = 1;
        return Math.floor((base64.length * 3) / 4) - padding;
    }

    var api = {
        formatDepositImportantText: formatDepositImportantText,
        getDataUrlByteSize: getDataUrlByteSize
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }

    globalScope.MobileDepositUtils = api;
})(typeof window !== 'undefined' ? window : globalThis);
