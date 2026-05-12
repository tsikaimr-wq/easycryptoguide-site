(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
        return;
    }

    root.mobileSessionUtils = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    function shouldRestoreMobileAppSession({
        hasActiveSession,
        hasFreshGrant,
        sameDeviceOwner,
        sameSessionOwner,
    }) {
        if (hasActiveSession) return false;
        return !!(hasFreshGrant || sameDeviceOwner || sameSessionOwner);
    }

    return {
        shouldRestoreMobileAppSession,
    };
});
