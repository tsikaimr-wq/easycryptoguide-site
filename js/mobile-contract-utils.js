(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
        return;
    }

    const api = factory();
    root.mobileContractUtils = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    function parseContractLotsInput(rawInput) {
        const text = String(rawInput ?? '').trim();

        if (!text) {
            return {
                text,
                isEmpty: true,
                isNumeric: false,
                isPositive: false,
                isInteger: false,
                value: NaN,
                flooredLots: 0,
            };
        }

        const value = Number(text);
        const isNumeric = Number.isFinite(value);
        const isPositive = isNumeric && value > 0;
        const isInteger = isPositive && Number.isInteger(value);

        return {
            text,
            isEmpty: false,
            isNumeric,
            isPositive,
            isInteger,
            value,
            flooredLots: isPositive ? Math.floor(value) : 0,
        };
    }

    function getContractPreviewLots(rawInput, maxLots) {
        const parsed = parseContractLotsInput(rawInput);
        const cappedMaxLots = Math.max(0, Math.floor(Number(maxLots) || 0));

        if (!parsed.isPositive) return 0;
        return Math.min(parsed.flooredLots, cappedMaxLots);
    }

    function validateContractTradeInput(rawInput, maxLots) {
        const parsed = parseContractLotsInput(rawInput);
        const cappedMaxLots = Math.max(0, Math.floor(Number(maxLots) || 0));

        if (cappedMaxLots <= 0) {
            return {
                ok: false,
                reason: 'no_balance',
                message: 'No available USDT balance. Please deposit funds first.',
            };
        }

        if (parsed.isEmpty || !parsed.isNumeric || !parsed.isPositive) {
            return {
                ok: false,
                reason: 'invalid_lot',
                message: 'Please enter a valid lot size.',
            };
        }

        if (!parsed.isInteger) {
            return {
                ok: false,
                reason: 'fractional_lot',
                message: 'Contract orders require whole lots. Minimum order size is 1 Lot.',
            };
        }

        if (parsed.value > cappedMaxLots) {
            return {
                ok: false,
                reason: 'insufficient_balance',
                message: `Insufficient available balance. Max open size is ${cappedMaxLots} Lot.`,
            };
        }

        return {
            ok: true,
            reason: 'ok',
            lots: parsed.value,
        };
    }

    return {
        parseContractLotsInput,
        getContractPreviewLots,
        validateContractTradeInput,
    };
});
