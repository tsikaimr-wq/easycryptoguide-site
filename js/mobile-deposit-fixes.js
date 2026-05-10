(function () {
    const utils = window.MobileDepositUtils || {};
    const formatDepositImportantText = utils.formatDepositImportantText || function (coin, chain) {
        return `Do not deposit any non-${coin}-${chain} assets to the address above. Unsupported deposits may not be recoverable.`;
    };
    const getDataUrlByteSize = utils.getDataUrlByteSize || function (dataUrl) {
        return String(dataUrl || '').length;
    };
    const MAX_DEPOSIT_VOUCHER_BYTES = 720 * 1024;
    const VOUCHER_STATE_KEY = '__depositVoucherImage';

    function getSelectedDepositCoin() {
        const title = (document.getElementById('deposit-detail-title')?.innerText || '').trim();
        const match = title.match(/^([A-Z0-9]+)\s+Deposit/i);
        return match ? match[1].toUpperCase() : 'USDT';
    }

    function getSelectedDepositChain() {
        const activeChain = document.querySelector('#deposit-chain-buttons .chain-btn.active');
        return (activeChain?.innerText || 'TRC20').trim().toUpperCase();
    }

    function applyDepositCopy() {
        const importantText = document.getElementById('deposit-important-text');
        if (!importantText) return;
        importantText.innerText = formatDepositImportantText(getSelectedDepositCoin(), getSelectedDepositChain());
    }

    function installDepositStyleFix() {
        if (document.getElementById('deposit-important-style-fix')) return;
        const style = document.createElement('style');
        style.id = 'deposit-important-style-fix';
        style.textContent = `
            .important-notes p {
                position: relative;
                padding-left: 14px;
            }
            .important-notes p::before {
                content: "•" !important;
                position: absolute;
                left: 0;
                top: 0;
                color: #6a35ff;
                font-weight: 700;
            }
        `;
        document.head.appendChild(style);
    }

    function readFileAsDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error || new Error('Failed to read file.'));
            reader.readAsDataURL(file);
        });
    }

    function loadImageFromDataUrl(dataUrl) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error('Failed to process voucher image.'));
            image.src = dataUrl;
        });
    }

    async function compressVoucherImage(file) {
        const initialDataUrl = await readFileAsDataUrl(file);
        if (getDataUrlByteSize(initialDataUrl) <= MAX_DEPOSIT_VOUCHER_BYTES) {
            return initialDataUrl;
        }

        const image = await loadImageFromDataUrl(initialDataUrl);
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error('This device does not support voucher compression.');

        let width = image.naturalWidth || image.width || 1;
        let height = image.naturalHeight || image.height || 1;
        const maxDimension = 1600;
        const largestSide = Math.max(width, height);
        if (largestSide > maxDimension) {
            const scale = maxDimension / largestSide;
            width = Math.max(1, Math.round(width * scale));
            height = Math.max(1, Math.round(height * scale));
        }

        let quality = 0.86;
        let output = initialDataUrl;

        for (let attempt = 0; attempt < 8; attempt += 1) {
            canvas.width = width;
            canvas.height = height;
            context.clearRect(0, 0, width, height);
            context.drawImage(image, 0, 0, width, height);
            output = canvas.toDataURL('image/jpeg', quality);

            if (getDataUrlByteSize(output) <= MAX_DEPOSIT_VOUCHER_BYTES) {
                return output;
            }

            if (quality > 0.52) {
                quality -= 0.08;
            } else {
                width = Math.max(800, Math.round(width * 0.85));
                height = Math.max(800, Math.round(height * 0.85));
                quality = Math.max(0.42, quality - 0.04);
            }
        }

        throw new Error('Voucher image is still too large after compression. Please crop the screenshot and try again.');
    }

    const originalResetVoucher = window.resetVoucher;
    const originalUpdateDepositDetailUI = window.updateDepositDetailUI;

    window.handleVoucherUpload = async function handleVoucherUploadPatched(input) {
        const statusMsg = document.getElementById('voucher-status-msg');
        const uploadBox = document.getElementById('voucher-upload-box');
        const previewContainer = document.getElementById('voucher-preview-container');

        if (!statusMsg || !uploadBox || !previewContainer) return;

        statusMsg.innerText = '';
        uploadBox.classList.remove('error', 'uploaded');

        if (!(input.files && input.files[0])) return;

        const file = input.files[0];
        if (!file.type.match('image.*')) {
            statusMsg.innerText = 'Invalid file type. Please upload an image (.jpg, .png, etc.)';
            statusMsg.style.color = '#ff4757';
            uploadBox.classList.add('error');
            input.value = '';
            return;
        }

        if (file.size > 5242880) {
            statusMsg.innerText = 'File too large. Maximum size is 5MB.';
            statusMsg.style.color = '#ff4757';
            uploadBox.classList.add('error');
            input.value = '';
            return;
        }

        try {
            const compressedDataUrl = await compressVoucherImage(file);
            window[VOUCHER_STATE_KEY] = compressedDataUrl;
            previewContainer.innerHTML = `<img src="${compressedDataUrl}" alt="Preview" style="width:100%;height:100%;object-fit:cover;">`;
            uploadBox.classList.add('uploaded');
            statusMsg.innerText = 'Success! Voucher uploaded.';
            statusMsg.style.color = '#2ED573';
        } catch (error) {
            window[VOUCHER_STATE_KEY] = null;
            uploadBox.classList.add('error');
            input.value = '';
            statusMsg.innerText = error.message || 'Failed to process voucher image.';
            statusMsg.style.color = '#ff4757';
        }
    };

    window.resetVoucher = function resetVoucherPatched() {
        window[VOUCHER_STATE_KEY] = null;
        if (typeof originalResetVoucher === 'function') {
            originalResetVoucher();
            return;
        }
        const voucherInput = document.getElementById('voucher-input');
        const previewContainer = document.getElementById('voucher-preview-container');
        const uploadBox = document.getElementById('voucher-upload-box');
        const statusMsg = document.getElementById('voucher-status-msg');
        if (voucherInput) voucherInput.value = '';
        if (previewContainer) {
            previewContainer.innerHTML = `<svg width="40" height="40" viewBox="0 0 24 24" fill="#9CA3AF" xmlns="http://www.w3.org/2000/svg"><path d="M12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8Z" /><path fill-rule="evenodd" clip-rule="evenodd" d="M19 4H15.82C15.42 2.84 14.33 2 13.06 2H10.94C9.67 2 8.58001 2.84 8.18001 4H5C3.34 4 2 5.34 2 7V17C2 18.66 3.34 20 5 20H19C20.66 20 22 18.66 22 17V7C22 5.34 20.66 4 19 4ZM12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18Z" /></svg>`;
        }
        if (uploadBox) uploadBox.classList.remove('uploaded', 'error');
        if (statusMsg) statusMsg.innerText = '';
    };

    window.submitDepositForm = async function submitDepositFormPatched() {
        if (window.guardKycForAction && window.guardKycForAction('submitting a deposit')) return;

        const amountInput = document.getElementById('deposit-amount');
        const outgoingAddressInput = document.getElementById('deposit-outgoing-address');
        const submitBtn = document.querySelector('#deposit-screen .next-step-btn') || document.querySelector('.next-step-btn');
        const originalText = submitBtn ? submitBtn.innerText : 'Next step';

        const amount = amountInput?.value.trim() || '';
        const outgoingAddress = outgoingAddressInput?.value.trim() || '';
        const coin = getSelectedDepositCoin();
        const chain = getSelectedDepositChain();
        const chainData = ((window.adminDepositData || {})[coin] || {})[chain] || {};
        const voucher = window[VOUCHER_STATE_KEY];

        if (!chainData.walletAddress || !chainData.qrCode) {
            alert('This deposit method is currently unavailable. Please contact admin.');
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            alert('Please enter a valid deposit amount.');
            return;
        }

        if (!voucher) {
            alert('Please upload a payment voucher screenshot.');
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerText = 'Submitting...';
        }

        try {
            if (typeof window.fire_submitDeposit !== 'function') {
                throw new Error('System not ready. Please try again in 2 seconds.');
            }

            await window.fire_submitDeposit({
                coin,
                chain,
                amount,
                outgoingAddress,
                voucher
            });

            alert('Deposit request submitted successfully! Waiting for confirmation.');

            if (amountInput) amountInput.value = '';
            if (outgoingAddressInput) outgoingAddressInput.value = '';
            window.resetVoucher();

            if (typeof window.toggleDepositDetail === 'function') window.toggleDepositDetail(false);
            if (typeof window.goBack === 'function') window.goBack();
        } catch (error) {
            console.error('Submission Error:', error);
            alert('Failed to submit deposit: ' + error.message);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
            }
        }
    };

    window.updateDepositDetailUI = function updateDepositDetailUIPatched() {
        if (typeof originalUpdateDepositDetailUI === 'function') {
            originalUpdateDepositDetailUI();
        }
        applyDepositCopy();
    };

    function initializeDepositFixes() {
        installDepositStyleFix();
        applyDepositCopy();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeDepositFixes, { once: true });
    } else {
        initializeDepositFixes();
    }
})();
