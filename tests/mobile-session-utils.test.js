const test = require('node:test');
const assert = require('node:assert/strict');

const {
    shouldRestoreMobileAppSession,
} = require('../js/mobile-session-utils.js');

test('restores mobile app session when the current device already owns the remote mobile session', () => {
    assert.equal(shouldRestoreMobileAppSession({
        hasActiveSession: false,
        hasFreshGrant: false,
        sameDeviceOwner: true,
        sameSessionOwner: false,
    }), true);
});

test('restores mobile app session when login just granted a fresh mobile session', () => {
    assert.equal(shouldRestoreMobileAppSession({
        hasActiveSession: false,
        hasFreshGrant: true,
        sameDeviceOwner: false,
        sameSessionOwner: false,
    }), true);
});

test('does not restore mobile app session for unrelated sessions without a fresh grant', () => {
    assert.equal(shouldRestoreMobileAppSession({
        hasActiveSession: false,
        hasFreshGrant: false,
        sameDeviceOwner: false,
        sameSessionOwner: false,
    }), false);
});

test('does not need restoration when session is already active', () => {
    assert.equal(shouldRestoreMobileAppSession({
        hasActiveSession: true,
        hasFreshGrant: true,
        sameDeviceOwner: true,
        sameSessionOwner: true,
    }), false);
});
