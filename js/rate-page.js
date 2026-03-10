(function () {
    const RATE_UNIVERSE = [
        { symbol: 'BTC', name: 'Bitcoin', id: 'bitcoin', accent: 'amber' },
        { symbol: 'ETH', name: 'Ethereum', id: 'ethereum', accent: 'blue' },
        { symbol: 'SOL', name: 'Solana', id: 'solana', accent: 'green' },
        { symbol: 'XRP', name: 'XRP', id: 'ripple', accent: 'blue' },
        { symbol: 'BNB', name: 'BNB', id: 'binancecoin', accent: 'amber' },
        { symbol: 'ADA', name: 'Cardano', id: 'cardano', accent: 'blue' },
        { symbol: 'DOGE', name: 'Dogecoin', id: 'dogecoin', accent: 'amber' },
        { symbol: 'AVAX', name: 'Avalanche', id: 'avalanche-2', accent: 'red' },
        { symbol: 'LINK', name: 'Chainlink', id: 'chainlink', accent: 'blue' },
        { symbol: 'DOT', name: 'Polkadot', id: 'polkadot', accent: 'green' },
        { symbol: 'LTC', name: 'Litecoin', id: 'litecoin', accent: 'amber' },
        { symbol: 'BCH', name: 'Bitcoin Cash', id: 'bitcoin-cash', accent: 'amber' },
        { symbol: 'TRX', name: 'TRON', id: 'tron', accent: 'red' },
        { symbol: 'XLM', name: 'Stellar', id: 'stellar', accent: 'blue' },
        { symbol: 'TON', name: 'Toncoin', id: 'the-open-network', accent: 'blue' },
        { symbol: 'SUI', name: 'Sui', id: 'sui', accent: 'blue' },
        { symbol: 'HBAR', name: 'Hedera', id: 'hedera-hashgraph', accent: 'green' },
        { symbol: 'ALGO', name: 'Algorand', id: 'algorand', accent: 'blue' },
        { symbol: 'XMR', name: 'Monero', id: 'monero', accent: 'amber' },
        { symbol: 'ICP', name: 'Internet Computer', id: 'internet-computer', accent: 'blue' },
        { symbol: 'NEO', name: 'NEO', id: 'neo', accent: 'green' },
        { symbol: 'IOTA', name: 'IOTA', id: 'iota', accent: 'blue' },
        { symbol: 'MANA', name: 'Decentraland', id: 'decentraland', accent: 'red' },
        { symbol: 'ETC', name: 'Ethereum Classic', id: 'ethereum-classic', accent: 'green' },
        { symbol: 'AXS', name: 'Axie Infinity', id: 'axie-infinity', accent: 'blue' },
        { symbol: 'SAND', name: 'The Sandbox', id: 'the-sandbox', accent: 'amber' },
        { symbol: 'VET', name: 'VeChain', id: 'vechain', accent: 'green' },
        { symbol: 'YFI', name: 'yearn.finance', id: 'yearn-finance', accent: 'blue' },
        { symbol: 'CHZ', name: 'Chiliz', id: 'chiliz', accent: 'red' },
        { symbol: 'HYPE', name: 'Hyperliquid', id: 'hyperliquid', accent: 'green' },
        { symbol: 'IP', name: 'Story', id: 'story-2', accent: 'amber' },
        { symbol: 'WBT', name: 'WhiteBIT Coin', id: 'whitebit', accent: 'blue' },
        { symbol: 'USDC', name: 'USD Coin', id: 'usd-coin', accent: 'blue' },
        { symbol: 'DAI', name: 'Dai', id: 'dai', accent: 'amber' },
        { symbol: 'USDE', name: 'Ethena USDe', id: 'ethena-usde', accent: 'green' }
    ];

    const COPY = {
        en: {
            loading: 'Loading live rates...',
            noMatch: 'No matching assets found.',
            noData: 'Live market data unavailable. Retrying...',
            searchPlaceholder: 'Filter list',
            liveBuy: 'Buy',
            liveSell: 'Sell',
            liveWatch: 'Watch'
        },
        de: {
            loading: 'Live-Kurse werden geladen...',
            noMatch: 'Keine passenden Assets gefunden.',
            noData: 'Marktdaten derzeit nicht verfugbar. Neuer Versuch...',
            searchPlaceholder: 'Liste filtern',
            liveBuy: 'Kaufen',
            liveSell: 'Verkaufen',
            liveWatch: 'Beobachten'
        }
    };

    const BRIDGE_POLL_MS = 15000;
    const SIMPLE_REFRESH_MS = 10000;
    const WEEKLY_REFRESH_MS = 180000;
    const PRICE_SPREAD_RATE = 0.005;
    const DEFAULT_LANG = 'en';
    const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
    const COINGECKO_DEMO_KEY = String(window.EC_COINGECKO_DEMO_KEY || localStorage.getItem('ec_coingecko_demo_key') || '').trim();
    const COINGECKO_PROXY_URL = (() => {
        const manual = String(window.EC_COINGECKO_PROXY_URL || localStorage.getItem('ec_coingecko_proxy_url') || '').trim();
        if (manual) return manual;
        const host = String(window.location.hostname || '').toLowerCase();
        const frontendHosts = new Set([
            'easycryptoguide.com',
            'www.easycryptoguide.com',
            'm.easycryptoguide.com'
        ]);
        return frontendHosts.has(host) ? '/api/coingecko/simple-price' : '';
    })();

    const ENABLE_IFRAME_BRIDGE = /[?&]bridge=1(?:&|$)/i.test(window.location.search);

    const dom = {
        bridge: document.getElementById('rate-data-bridge'),
        todayList: document.getElementById('rate-today-list'),
        weekList: document.getElementById('rate-week-list'),
        tableBody: document.getElementById('rate-table-body'),
        emptyState: document.getElementById('rate-empty-state'),
        searchInput: document.getElementById('rate-search-input'),
        usdToggle: document.getElementById('rate-usd-toggle'),
        usdLabel: document.getElementById('rate-usd-label')
    };

    if (!dom.todayList || !dom.weekList || !dom.tableBody || !dom.emptyState) {
        return;
    }

    const state = {
        quoteCurrency: 'USD',
        search: '',
        currentLang: DEFAULT_LANG,
        liveStore: {},
        simpleMeta: {},
        weeklyMeta: {},
        liveReady: false,
        hasAnyData: false,
        simpleOk: false,
        simpleError: '',
        lastRenderKey: ''
    };

    function toNumber(value, fallback) {
        const num = Number(value);
        return Number.isFinite(num) ? num : (fallback === undefined ? NaN : fallback);
    }

    function firstPositive(values) {
        for (let i = 0; i < values.length; i += 1) {
            const num = toNumber(values[i], 0);
            if (num > 0) return num;
        }
        return 0;
    }

    function firstFinite(values) {
        for (let i = 0; i < values.length; i += 1) {
            const num = toNumber(values[i], NaN);
            if (Number.isFinite(num)) return num;
        }
        return NaN;
    }

    function chunkArray(items, size) {
        const chunks = [];
        for (let i = 0; i < items.length; i += size) {
            chunks.push(items.slice(i, i + size));
        }
        return chunks;
    }

    function normalizeLang(value) {
        const raw = String(value || '').trim().toLowerCase();
        if (!raw) return DEFAULT_LANG;
        if (raw === 'en' || raw === 'english') return 'en';
        if (raw === 'de' || raw === 'deutsch') return 'de';
        if (raw === 'zh' || raw === 'zh-cn' || raw === 'chinese') return 'en';
        if (raw === 'ja' || raw === 'japanese') return 'en';
        if (raw === 'ko' || raw === 'korean') return 'en';
        return DEFAULT_LANG;
    }

    function getActiveLang() {
        if (typeof window.ecGetSiteLanguage === 'function') {
            return normalizeLang(window.ecGetSiteLanguage());
        }
        return normalizeLang(localStorage.getItem('ec_site_lang') || localStorage.getItem('ec_language'));
    }

    function getCopy(key) {
        const dict = COPY[state.currentLang] || COPY.en;
        return dict[key] || COPY.en[key] || '';
    }

    function applyDynamicCopy() {
        state.currentLang = getActiveLang();
        if (dom.searchInput) dom.searchInput.placeholder = getCopy('searchPlaceholder');
        if (dom.usdLabel) dom.usdLabel.textContent = state.quoteCurrency;
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function formatPrice(value) {
        if (!(value > 0)) return '--';
        let min = 2;
        let max = 2;
        if (value < 1) {
            min = 4;
            max = 6;
        } else if (value < 100) {
            min = 2;
            max = 4;
        }
        return '$' + new Intl.NumberFormat('en-US', {
            minimumFractionDigits: min,
            maximumFractionDigits: max
        }).format(value);
    }

    function formatPercent(value) {
        if (!Number.isFinite(value)) return '--';
        const sign = value > 0 ? '+' : '';
        return sign + value.toFixed(2) + '%';
    }

    function formatVolume(value) {
        if (!(value > 0)) return '24h Vol --';
        return '24h Vol $' + new Intl.NumberFormat('en-US', {
            notation: 'compact',
            maximumFractionDigits: 2
        }).format(value);
    }

    async function fetchJson(url, options) {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 15000);
        try {
            const response = await fetch(url, { ...(options || {}), signal: controller.signal });
            return response;
        } finally {
            window.clearTimeout(timeout);
        }
    }

    async function fetchSimplePriceChunk(idsChunk) {
        const params = new URLSearchParams({
            ids: idsChunk.join(','),
            vs_currencies: 'usd',
            include_24hr_change: 'true',
            include_24hr_vol: 'true',
            include_last_updated_at: 'true'
        });

        if (COINGECKO_PROXY_URL) {
            const glue = COINGECKO_PROXY_URL.indexOf('?') >= 0 ? '&' : '?';
            const proxyUrl = COINGECKO_PROXY_URL + glue + params.toString();
            try {
                const proxyRes = await fetchJson(proxyUrl, { headers: { accept: 'application/json' } });
                if (proxyRes.ok) return await proxyRes.json();
            } catch (err) {
                console.warn('Rate page proxy fetch failed:', err && err.message ? err.message : err);
            }
        }

        const directUrl = COINGECKO_BASE_URL + '/simple/price?' + params.toString();
        const headerVariants = [];
        if (COINGECKO_DEMO_KEY) {
            headerVariants.push({ accept: 'application/json', 'x-cg-demo-api-key': COINGECKO_DEMO_KEY });
        }
        headerVariants.push({ accept: 'application/json' });

        let lastError = '';
        for (let i = 0; i < headerVariants.length; i += 1) {
            try {
                const directRes = await fetchJson(directUrl, { headers: headerVariants[i] });
                if (directRes.ok) return await directRes.json();
                lastError = 'HTTP ' + directRes.status;
            } catch (err) {
                lastError = err && err.message ? err.message : String(err);
            }
        }

        throw new Error('simple-price failed: ' + lastError);
    }

    async function fetchWeeklyMarkets(idsCsv) {
        const params = new URLSearchParams({
            vs_currency: 'usd',
            ids: idsCsv,
            order: 'market_cap_desc',
            per_page: '250',
            page: '1',
            sparkline: 'false',
            price_change_percentage: '7d',
            locale: 'en'
        });

        const url = COINGECKO_BASE_URL + '/coins/markets?' + params.toString();
        const headerVariants = [];
        if (COINGECKO_DEMO_KEY) {
            headerVariants.push({ accept: 'application/json', 'x-cg-demo-api-key': COINGECKO_DEMO_KEY });
        }
        headerVariants.push({ accept: 'application/json' });

        let lastError = '';
        for (let i = 0; i < headerVariants.length; i += 1) {
            try {
                const response = await fetchJson(url, { headers: headerVariants[i] });
                if (response.ok) return await response.json();
                lastError = 'HTTP ' + response.status;
            } catch (err) {
                lastError = err && err.message ? err.message : String(err);
            }
        }
        throw new Error('coins/markets failed: ' + lastError);
    }

    async function refreshSimpleMeta() {
        const ids = RATE_UNIVERSE.map((item) => item.id).filter(Boolean);
        const chunks = chunkArray(ids, 45);
        const nextMeta = { ...state.simpleMeta };
        let updated = 0;

        for (let i = 0; i < chunks.length; i += 1) {
            const payload = await fetchSimplePriceChunk(chunks[i]);
            Object.keys(payload || {}).forEach((id) => {
                const entry = payload[id] || {};
                if (!Number.isFinite(Number(entry.usd))) return;
                nextMeta[id] = {
                    price: toNumber(entry.usd, 0),
                    dayChange: toNumber(entry.usd_24h_change, NaN),
                    volume: toNumber(entry.usd_24h_vol, 0),
                    updatedAt: toNumber(entry.last_updated_at, 0)
                };
                updated += 1;
            });
        }

        state.simpleMeta = nextMeta;
        state.simpleOk = updated > 0;
        state.simpleError = '';
        render();
    }

    async function refreshWeeklyMeta() {
        const ids = RATE_UNIVERSE.map((item) => item.id).filter(Boolean);
        if (ids.length === 0) return;
        const payload = await fetchWeeklyMarkets(ids.join(','));
        const nextMeta = { ...state.weeklyMeta };

        (payload || []).forEach((item) => {
            if (!item || !item.id) return;
            nextMeta[item.id] = {
                name: item.name,
                image: item.image,
                price: toNumber(item.current_price, 0),
                dayChange: toNumber(item.price_change_percentage_24h_in_currency || item.price_change_percentage_24h, NaN),
                weekChange: toNumber(item.price_change_percentage_7d_in_currency, NaN),
                volume: toNumber(item.total_volume, 0)
            };
        });

        state.weeklyMeta = nextMeta;
        render();
    }

    function normalizeLiveStore(rawStore) {
        const normalized = {};
        if (!rawStore || typeof rawStore !== 'object') return normalized;
        Object.keys(rawStore).forEach((key) => {
            const source = rawStore[key];
            if (!source || typeof source !== 'object') return;
            const normalizedKey = String(key).toUpperCase().replace(/\s+/g, '');
            normalized[normalizedKey] = {
                price: toNumber(source.price || source.lastPrice, 0),
                dayChange: toNumber(source.change, NaN),
                volume: toNumber(source.volume, 0)
            };
        });
        return normalized;
    }

    function readBridgeStore() {
        if (!dom.bridge) return null;
        try {
            if (!dom.bridge.contentWindow || !dom.bridge.contentWindow.marketDataStore) return null;
            return dom.bridge.contentWindow.marketDataStore;
        } catch (error) {
            return null;
        }
    }

    function pollBridge() {
        if (!ENABLE_IFRAME_BRIDGE) return;
        const bridgeStore = readBridgeStore();
        if (!bridgeStore) return;
        state.liveStore = normalizeLiveStore(bridgeStore);
        state.liveReady = Object.keys(state.liveStore).length > 0;
        render();
    }

    function getLiveRecord(symbol) {
        const sym = String(symbol || '').toUpperCase();
        const preferred = state.quoteCurrency === 'USD'
            ? [`${sym}/USD`, `${sym}/USDT`]
            : [`${sym}/USDT`, `${sym}/USD`];
        for (let i = 0; i < preferred.length; i += 1) {
            const row = state.liveStore[preferred[i]];
            if (row && row.price > 0) return row;
        }
        return null;
    }

    function deriveWeekChange(dayChange) {
        if (!Number.isFinite(dayChange)) return 0;
        const estimate = (dayChange * 2.6) + (dayChange >= 0 ? 3.5 : -3.5);
        return Math.max(-95, Math.min(220, estimate));
    }

    function getDataset() {
        return RATE_UNIVERSE.map((coin) => {
            const live = getLiveRecord(coin.symbol) || {};
            const simple = state.simpleMeta[coin.id] || {};
            const weekly = state.weeklyMeta[coin.id] || {};
            const price = firstPositive([live.price, simple.price, weekly.price]);
            const dayChange = firstFinite([live.dayChange, simple.dayChange, weekly.dayChange]);
            const volume = firstPositive([live.volume, simple.volume, weekly.volume]);
            const weekChange = Number.isFinite(weekly.weekChange) ? weekly.weekChange : deriveWeekChange(dayChange);
            return {
                symbol: coin.symbol,
                name: weekly.name || coin.name,
                accent: coin.accent || 'blue',
                image: weekly.image || '',
                price,
                dayChange,
                weekChange,
                volume
            };
        }).filter((item) => item.price > 0 || Number.isFinite(item.dayChange));
    }

    function getFilteredDataset() {
        const query = state.search.trim().toLowerCase();
        const rows = getDataset();
        if (!query) return rows;
        return rows.filter((coin) => {
            return coin.symbol.toLowerCase().indexOf(query) >= 0 ||
                coin.name.toLowerCase().indexOf(query) >= 0;
        });
    }

    function buildIconMarkup(coin, className) {
        if (coin.image) {
            return '<span class="' + className + '"><img src="' + escapeHtml(coin.image) + '" alt="' + escapeHtml(coin.symbol) + '"></span>';
        }
        const letters = coin.symbol.length > 4 ? coin.symbol.slice(0, 2) : coin.symbol.slice(0, 3);
        return '<span class="' + className + ' rate-coin-fallback" data-accent="' + escapeHtml(coin.accent || 'blue') + '">' + escapeHtml(letters) + '</span>';
    }

    function buildSparklinePath(coin) {
        const seed = coin.symbol.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
        const values = [];
        const count = 11;
        const base = 18 + ((seed % 7) * 1.2);
        const drift = Number.isFinite(coin.dayChange) ? coin.dayChange * 0.22 : 0;
        const weekly = Number.isFinite(coin.weekChange) ? coin.weekChange * 0.08 : 0;
        for (let i = 0; i < count; i += 1) {
            const wave = Math.sin((i + seed) * 0.72) * 6;
            const noise = Math.cos((i + 2 + seed) * 0.37) * 3.2;
            const trend = ((i - (count - 1) / 2) * (drift / 5)) + (weekly / 9);
            values.push(base + wave + noise + trend);
        }
        const min = Math.min.apply(null, values);
        const max = Math.max.apply(null, values);
        const range = Math.max(1, max - min);
        return values.map((value, index) => {
            const x = (index / (count - 1)) * 132;
            const y = 36 - (((value - min) / range) * 30) - 3;
            return (index === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2);
        }).join(' ');
    }

    function getTrendTone(value) {
        if (value > 0.15) return 'positive';
        if (value < -0.15) return 'negative';
        return 'neutral';
    }

    function getTrendLabel(value) {
        if (value > 0.15) return getCopy('liveBuy');
        if (value < -0.15) return getCopy('liveSell');
        return getCopy('liveWatch');
    }

    function renderTopList(container, rows, metricKey) {
        const sorted = rows
            .filter((coin) => Number.isFinite(coin[metricKey]))
            .sort((a, b) => Number(b[metricKey]) - Number(a[metricKey]))
            .slice(0, 3);
        if (sorted.length === 0) {
            container.innerHTML = '';
            return;
        }
        container.innerHTML = sorted.map((coin) => {
            const tone = getTrendTone(coin[metricKey]);
            return '' +
                '<a class="rate-list-item" href="buy-sell.html">' +
                '  <span class="rate-list-main">' +
                buildIconMarkup(coin, 'rate-coin-icon') +
                '    <span class="rate-coin-copy">' +
                '      <span class="rate-coin-name">' + escapeHtml(coin.name) + '</span>' +
                '      <span class="rate-coin-symbol">(' + escapeHtml(coin.symbol) + ')</span>' +
                '    </span>' +
                '  </span>' +
                '  <span class="rate-list-side">' +
                '    <span class="rate-change ' + tone + '">' + formatPercent(coin[metricKey]) + '</span>' +
                '    <span class="rate-action-chip"><i class="ri-shopping-bag-3-line"></i></span>' +
                '  </span>' +
                '</a>';
        }).join('');
    }

    function renderTable(rows) {
        dom.tableBody.innerHTML = rows.map((coin) => {
            const sell = coin.price > 0 ? coin.price * (1 - PRICE_SPREAD_RATE) : 0;
            const buy = coin.price > 0 ? coin.price * (1 + PRICE_SPREAD_RATE) : 0;
            const tone = getTrendTone(coin.dayChange);
            return '' +
                '<tr>' +
                '  <td class="rate-table-icon-cell">' + buildIconMarkup(coin, 'rate-table-icon rate-coin-icon') + '</td>' +
                '  <td class="rate-name-cell">' +
                '    <div class="rate-name-block">' +
                '      <strong>' + escapeHtml(coin.name) + '</strong>' +
                '      <span>' + escapeHtml(formatVolume(coin.volume)) + '</span>' +
                '    </div>' +
                '  </td>' +
                '  <td><span class="rate-symbol-pill">' + escapeHtml(coin.symbol) + '/' + escapeHtml(state.quoteCurrency) + '</span></td>' +
                '  <td class="rate-price-cell">' + formatPrice(sell) + '</td>' +
                '  <td class="rate-price-cell">' + formatPrice(buy) + '</td>' +
                '  <td><span class="rate-change ' + tone + '">' + formatPercent(coin.dayChange) + '</span></td>' +
                '  <td>' +
                '    <div class="rate-trend-cell">' +
                '      <svg class="rate-sparkline ' + tone + '" viewBox="0 0 132 36" aria-hidden="true">' +
                '        <path d="' + buildSparklinePath(coin) + '"></path>' +
                '      </svg>' +
                '      <span class="rate-pill ' + tone + '">' + escapeHtml(getTrendLabel(coin.dayChange)) + '</span>' +
                '    </div>' +
                '  </td>' +
                '</tr>';
        }).join('');
    }

    function render() {
        const dataset = getDataset();
        state.hasAnyData = dataset.length > 0;
        const filteredRows = getFilteredDataset();
        const renderKey = [
            state.quoteCurrency,
            state.search,
            state.currentLang,
            filteredRows.length,
            filteredRows.slice(0, 20).map((row) => [
                row.symbol,
                row.price.toFixed(6),
                Number.isFinite(row.dayChange) ? row.dayChange.toFixed(4) : 'nan',
                Number.isFinite(row.weekChange) ? row.weekChange.toFixed(4) : 'nan'
            ].join(':')).join('|')
        ].join('||');

        if (renderKey !== state.lastRenderKey) {
            renderTopList(dom.todayList, dataset, 'dayChange');
            renderTopList(dom.weekList, dataset, 'weekChange');
            renderTable(filteredRows);
            state.lastRenderKey = renderKey;
        }

        if (filteredRows.length > 0) {
            dom.emptyState.classList.remove('visible');
            dom.emptyState.textContent = '';
            return;
        }

        dom.emptyState.classList.add('visible');
        if (!state.hasAnyData && !state.simpleOk && !state.liveReady) {
            dom.emptyState.textContent = state.simpleError ? getCopy('noData') : getCopy('loading');
            return;
        }
        dom.emptyState.textContent = getCopy('noMatch');
    }

    function syncToggleState() {
        if (!dom.usdToggle) return;
        dom.usdToggle.checked = state.quoteCurrency === 'USD';
        if (dom.usdLabel) dom.usdLabel.textContent = state.quoteCurrency;
    }

    function attachEvents() {
        if (dom.searchInput) {
            dom.searchInput.addEventListener('input', (event) => {
                state.search = String(event.target.value || '');
                render();
            });
        }
        if (dom.usdToggle) {
            dom.usdToggle.addEventListener('change', () => {
                state.quoteCurrency = dom.usdToggle.checked ? 'USD' : 'USDT';
                syncToggleState();
                render();
            });
        }
        if (dom.bridge) dom.bridge.addEventListener('load', pollBridge);
        document.addEventListener('ec-language-changed', () => {
            applyDynamicCopy();
            state.lastRenderKey = '';
            render();
        });
    }

    function startTimers() {
        if (ENABLE_IFRAME_BRIDGE) {
            window.setInterval(() => {
                pollBridge();
            }, BRIDGE_POLL_MS);
        }

        window.setInterval(() => {
            refreshSimpleMeta().catch((error) => {
                state.simpleOk = false;
                state.simpleError = error && error.message ? error.message : 'simple fetch failed';
                render();
            });
        }, SIMPLE_REFRESH_MS);

        window.setInterval(() => {
            refreshWeeklyMeta().catch(() => { });
        }, WEEKLY_REFRESH_MS);
    }

    applyDynamicCopy();
    syncToggleState();
    attachEvents();
    if (ENABLE_IFRAME_BRIDGE && dom.bridge) {
        const deferredSrc = dom.bridge.getAttribute('data-src');
        if (deferredSrc) dom.bridge.setAttribute('src', deferredSrc);
        pollBridge();
    }
    render();

    refreshSimpleMeta().catch((error) => {
        state.simpleOk = false;
        state.simpleError = error && error.message ? error.message : 'simple fetch failed';
        render();
    });

    refreshWeeklyMeta().catch(() => { });
    startTimers();
})();
