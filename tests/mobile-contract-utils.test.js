const test = require('node:test');
const assert = require('node:assert/strict');

const {
    parseContractLotsInput,
    getContractPreviewLots,
    validateContractTradeInput,
} = require('../js/mobile-contract-utils.js');

test('parseContractLotsInput preserves fractional values while exposing whole-lot preview', () => {
    const parsed = parseContractLotsInput('0.01');

    assert.equal(parsed.isNumeric, true);
    assert.equal(parsed.isPositive, true);
    assert.equal(parsed.isInteger, false);
    assert.equal(parsed.flooredLots, 0);
});

test('validateContractTradeInput prioritizes no-balance guidance before lot-size errors', () => {
    const validation = validateContractTradeInput('0.01', 0);

    assert.equal(validation.ok, false);
    assert.equal(validation.reason, 'no_balance');
    assert.match(validation.message, /deposit funds/i);
});

test('validateContractTradeInput rejects fractional lots with a specific whole-lot message', () => {
    const validation = validateContractTradeInput('0.01', 5);

    assert.equal(validation.ok, false);
    assert.equal(validation.reason, 'fractional_lot');
    assert.match(validation.message, /whole lots/i);
});

test('getContractPreviewLots floors positive input for display without mutating user text', () => {
    assert.equal(getContractPreviewLots('2.9', 10), 2);
    assert.equal(getContractPreviewLots('9', 3), 3);
});
