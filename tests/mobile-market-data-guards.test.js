const test = require('node:test');
const assert = require('node:assert/strict');

const {
    shouldEnableMockMarketData,
    shouldPromoteToMock,
    shouldAllowPublicMarketDataPreview
} = require('../js/mobile-market-data-guards.js');

test('enables mock market data only for local development hosts', () => {
    assert.equal(shouldEnableMockMarketData('localhost'), true);
    assert.equal(shouldEnableMockMarketData('127.0.0.1'), true);
    assert.equal(shouldEnableMockMarketData('easycoinst0re.com'), false);
});

test('promotes to mock only after the configured failure threshold', () => {
    assert.equal(shouldPromoteToMock(true, 2, 3), false);
    assert.equal(shouldPromoteToMock(true, 3, 3), true);
    assert.equal(shouldPromoteToMock(false, 99, 3), false);
});

test('allows public market data previews on unauthenticated market-style screens', () => {
    assert.equal(shouldAllowPublicMarketDataPreview({ target: 'market', authOverlayActive: true }), true);
    assert.equal(shouldAllowPublicMarketDataPreview({ target: 'trade', authOverlayActive: true }), true);
    assert.equal(shouldAllowPublicMarketDataPreview({ target: 'homeScreen', authOverlayActive: true }), true);
    assert.equal(shouldAllowPublicMarketDataPreview({ target: 'kline', authOverlayActive: true }), true);
    assert.equal(shouldAllowPublicMarketDataPreview({ target: 'funds', authOverlayActive: true }), false);
    assert.equal(shouldAllowPublicMarketDataPreview({ target: 'market', authOverlayActive: false }), true);
});
