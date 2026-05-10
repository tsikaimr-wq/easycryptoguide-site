const test = require('node:test');
const assert = require('node:assert/strict');

const {
    formatDepositImportantText,
    getDataUrlByteSize
} = require('../js/mobile-deposit-utils.js');

test('formatDepositImportantText builds readable deposit warning text', () => {
    assert.equal(
        formatDepositImportantText('USDT', 'TRC20'),
        'Do not deposit any non-USDT-TRC20 assets to the address above. Unsupported deposits may not be recoverable.'
    );
});

test('getDataUrlByteSize returns the decoded payload size', () => {
    assert.equal(getDataUrlByteSize('data:image/png;base64,QUJD'), 3);
    assert.equal(getDataUrlByteSize('data:image/png;base64,SGVsbG8='), 5);
    assert.equal(getDataUrlByteSize(''), 0);
});
