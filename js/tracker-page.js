(function () {
    const HOLDINGS = [
        { symbol: 'BTC', id: 'bitcoin', name: 'Bitcoin', qty: 0.86, cost: 62350 },
        { symbol: 'ETH', id: 'ethereum', name: 'Ethereum', qty: 7.4, cost: 2140 },
        { symbol: 'SOL', id: 'solana', name: 'Solana', qty: 155, cost: 138 },
        { symbol: 'XRP', id: 'ripple', name: 'XRP', qty: 12800, cost: 0.57 },
        { symbol: 'BNB', id: 'binancecoin', name: 'BNB', qty: 19, cost: 486 },
        { symbol: 'ADA', id: 'cardano', name: 'Cardano', qty: 9800, cost: 0.41 },
        { symbol: 'DOGE', id: 'dogecoin', name: 'Dogecoin', qty: 102000, cost: 0.083 },
        { symbol: 'LINK', id: 'chainlink', name: 'Chainlink', qty: 860, cost: 12.4 },
        { symbol: 'DOT', id: 'polkadot', name: 'Polkadot', qty: 1200, cost: 6.18 },
        { symbol: 'AVAX', id: 'avalanche-2', name: 'Avalanche', qty: 410, cost: 28.6 },
        { symbol: 'TON', id: 'the-open-network', name: 'Toncoin', qty: 1900, cost: 2.9 },
        { symbol: 'SUI', id: 'sui', name: 'Sui', qty: 7300, cost: 1.24 },
        { symbol: 'ALGO', id: 'algorand', name: 'Algorand', qty: 19800, cost: 0.17 },
        { symbol: 'NEO', id: 'neo', name: 'NEO', qty: 490, cost: 10.4 },
        { symbol: 'IOTA', id: 'iota', name: 'IOTA', qty: 9800, cost: 0.24 },
        { symbol: 'MANA', id: 'decentraland', name: 'Decentraland', qty: 16500, cost: 0.38 }
    ];

    const POLL_MS = 10000;
    const META_REFRESH_MS = 180000;
    const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
    const COINGECKO_DEMO_KEY = String(window.EC_COINGECKO_DEMO_KEY || localStorage.getItem('ec_coingecko_demo_key') || '').trim();
    const COINGECKO_PROXY_URL = (() => {
        const manual = String(window.EC_COINGECKO_PROXY_URL || localStorage.getItem('ec_coingecko_proxy_url') || '').trim();
        if (manual) return manual;
        const host = String(window.location.hostname || '').toLowerCase();
        const frontendHosts = new Set(['easycryptoguide.com', 'www.easycryptoguide.com', 'm.easycryptoguide.com']);
        return frontendHosts.has(host) ? '/api/coingecko/simple-price' : '';
    })();

    const COPY = {
        en: {
            searchPlaceholder: 'Search asset',
            noData: 'Live market data unavailable. Retrying...',
            noMatch: 'No matching assets found.',
            loading: 'Loading...',
            updatedAt: 'Updated {time}',
            assetsCount: '{count} assets tracked',
            splitLabel: '{wins} up / {losses} down',
            moverUp: 'Gainer',
            moverDown: 'Loser'
        },
        zh: {
            searchPlaceholder: '搜索币种',
            noData: '暂时无法获取实时行情，正在重试...',
            noMatch: '未找到匹配的币种。',
            loading: '加载中...',
            updatedAt: '更新时间 {time}',
            assetsCount: '已追踪 {count} 个资产',
            splitLabel: '上涨 {wins} / 下跌 {losses}',
            moverUp: '涨幅',
            moverDown: '跌幅'
        },
        de: {
            searchPlaceholder: 'Asset suchen',
            noData: 'Live-Marktdaten nicht verfugbar. Neuer Versuch...',
            noMatch: 'Keine passenden Assets gefunden.',
            loading: 'Wird geladen...',
            updatedAt: 'Aktualisiert {time}',
            assetsCount: '{count} Assets verfolgt',
            splitLabel: '{wins} steigend / {losses} fallend',
            moverUp: 'Gewinner',
            moverDown: 'Verlierer'
        },
        ja: {
            searchPlaceholder: '銘柄を検索',
            noData: 'リアルタイムデータを取得できません。再試行中です...',
            noMatch: '一致する銘柄が見つかりません。',
            loading: '読み込み中...',
            updatedAt: '更新 {time}',
            assetsCount: '{count} 資産を追跡中',
            splitLabel: '上昇 {wins} / 下落 {losses}',
            moverUp: '上昇',
            moverDown: '下落'
        },
        ko: {
            searchPlaceholder: '자산 검색',
            noData: '실시간 시세를 불러오지 못했습니다. 재시도 중...',
            noMatch: '일치하는 자산이 없습니다.',
            loading: '로딩 중...',
            updatedAt: '업데이트 {time}',
            assetsCount: '{count}개 자산 추적 중',
            splitLabel: '상승 {wins} / 하락 {losses}',
            moverUp: '상승',
            moverDown: '하락'
        }
    };

    const dom = {
        updatedAt: document.getElementById('tracker-updated-at'),
        totalValue: document.getElementById('tracker-total-value'),
        dayPnl: document.getElementById('tracker-day-pnl'),
        dayPnlRate: document.getElementById('tracker-day-pnl-rate'),
        openCount: document.getElementById('tracker-open-count'),
        openSplit: document.getElementById('tracker-open-split'),
        volatility: document.getElementById('tracker-volatility'),
        marketDepth: document.getElementById('tracker-market-depth'),
        investedValue: document.getElementById('tracker-invested-value'),
        currentValue: document.getElementById('tracker-current-value'),
        unrealizedValue: document.getElementById('tracker-unrealized-value'),
        allocationList: document.getElementById('tracker-allocation-list'),
        moversList: document.getElementById('tracker-movers-list'),
        searchInput: document.getElementById('tracker-search-input'),
        sortSelect: document.getElementById('tracker-sort-select'),
        refreshBtn: document.getElementById('tracker-refresh-btn'),
        tableBody: document.getElementById('tracker-holdings-body'),
        emptyState: document.getElementById('tracker-empty-state')
    };

    if (Object.keys(dom).some((key) => !dom[key])) return;

    const state = {
        lang: 'en',
        search: '',
        sort: dom.sortSelect.value || 'value',
        rows: [],
        marketMeta: {},
        isLoading: false,
        errorText: '',
        lastMetaAt: 0,
        lastUpdatedAt: 0
    };

    function normalizeLang(value) {
        const raw = String(value || '').trim().toLowerCase();
        if (raw === 'zh' || raw === 'cn' || raw === 'zh-cn') return 'zh';
        if (raw === 'de' || raw === 'deutsch') return 'de';
        if (raw === 'ja' || raw === 'jp') return 'ja';
        if (raw === 'ko' || raw === 'kr') return 'ko';
        return 'en';
    }

    function getLang() {
        if (typeof window.ecGetSiteLanguage === 'function') return normalizeLang(window.ecGetSiteLanguage());
        return normalizeLang(localStorage.getItem('ec_site_lang') || localStorage.getItem('ec_language'));
    }

    function t(key) {
        const dict = COPY[state.lang] || COPY.en;
        return dict[key] || COPY.en[key] || '';
    }

    function interpolate(template, values) {
        return String(template || '').replace(/\{(\w+)\}/g, (_, token) => (values[token] == null ? '' : String(values[token])));
    }

    function toNumber(value, fallback) {
        const num = Number(value);
        return Number.isFinite(num) ? num : (fallback === undefined ? NaN : fallback);
    }

    function escapeHtml(value) {
        return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function formatMoney(value) {
        const num = toNumber(value, 0);
        const abs = Math.abs(num);
        let max = 2;
        if (abs > 0 && abs < 1) max = 6;
        else if (abs < 100) max = 4;
        return '$' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: max }).format(num);
    }

    function formatSignedMoney(value) {
        const num = toNumber(value, 0);
        return (num > 0 ? '+' : '') + formatMoney(num);
    }

    function formatPercent(value) {
        const num = toNumber(value, NaN);
        if (!Number.isFinite(num)) return '--';
        return (num > 0 ? '+' : '') + num.toFixed(2) + '%';
    }

    function formatPercentUnsigned(value) {
        const num = toNumber(value, NaN);
        if (!Number.isFinite(num)) return '--';
        return num.toFixed(2) + '%';
    }

    function formatQty(value) {
        const num = toNumber(value, 0);
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: num < 1 ? 5 : 4 }).format(num);
    }

    function formatClock(ts) {
        if (!(ts > 0)) return '--:--:--';
        return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date(ts));
    }

    function applyTone(el, value) {
        el.classList.remove('tracker-positive', 'tracker-negative');
        if (value > 0) el.classList.add('tracker-positive');
        else if (value < 0) el.classList.add('tracker-negative');
    }

    function chunkArray(items, size) {
        const out = [];
        for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
        return out;
    }

    async function fetchWithTimeout(url, options) {
        const controller = new AbortController();
        const timer = window.setTimeout(() => controller.abort(), 12000);
        try {
            return await fetch(url, { ...(options || {}), signal: controller.signal });
        } finally {
            window.clearTimeout(timer);
        }
    }

    async function fetchSimpleChunk(idsChunk) {
        const params = new URLSearchParams({
            ids: idsChunk.join(','),
            vs_currencies: 'usd',
            include_24hr_change: 'true',
            include_last_updated_at: 'true'
        });

        if (COINGECKO_PROXY_URL) {
            const glue = COINGECKO_PROXY_URL.indexOf('?') >= 0 ? '&' : '?';
            const proxyRes = await fetchWithTimeout(COINGECKO_PROXY_URL + glue + params.toString(), { headers: { accept: 'application/json' } });
            if (proxyRes.ok) return await proxyRes.json();
        }

        const headers = { accept: 'application/json' };
        if (COINGECKO_DEMO_KEY) headers['x-cg-demo-api-key'] = COINGECKO_DEMO_KEY;
        const directRes = await fetchWithTimeout(COINGECKO_BASE_URL + '/simple/price?' + params.toString(), { headers: headers });
        if (!directRes.ok) throw new Error('simple-price HTTP ' + directRes.status);
        return await directRes.json();
    }
    async function fetchMarketMeta() {
        const params = new URLSearchParams({
            vs_currency: 'usd',
            ids: HOLDINGS.map((item) => item.id).join(','),
            order: 'market_cap_desc',
            per_page: '250',
            page: '1',
            sparkline: 'false',
            price_change_percentage: '24h',
            locale: 'en'
        });
        const headers = { accept: 'application/json' };
        if (COINGECKO_DEMO_KEY) headers['x-cg-demo-api-key'] = COINGECKO_DEMO_KEY;
        const response = await fetchWithTimeout(COINGECKO_BASE_URL + '/coins/markets?' + params.toString(), { headers: headers });
        if (!response.ok) throw new Error('coins/markets HTTP ' + response.status);
        const payload = await response.json();
        const meta = {};
        (payload || []).forEach((item) => {
            if (!item || !item.id) return;
            meta[item.id] = { image: item.image || '', name: item.name || '' };
        });
        state.marketMeta = meta;
        state.lastMetaAt = Date.now();
    }

    function calcDayPnl(positionValue, dayChange) {
        if (!Number.isFinite(dayChange)) return 0;
        const denominator = 1 + (dayChange / 100);
        if (!(denominator > 0)) return 0;
        return positionValue - (positionValue / denominator);
    }

    function buildRows(simpleMap) {
        const rows = HOLDINGS.map((holding) => {
            const simple = simpleMap[holding.id] || {};
            const meta = state.marketMeta[holding.id] || {};
            const marketPrice = toNumber(simple.usd, 0);
            if (!(marketPrice > 0)) return null;
            const dayChange = toNumber(simple.usd_24h_change, NaN);
            const positionValue = holding.qty * marketPrice;
            const invested = holding.qty * holding.cost;
            const pnl = positionValue - invested;
            return {
                symbol: holding.symbol,
                name: meta.name || holding.name,
                image: meta.image || '',
                qty: holding.qty,
                cost: holding.cost,
                marketPrice: marketPrice,
                positionValue: positionValue,
                invested: invested,
                pnl: pnl,
                pnlRate: invested > 0 ? (pnl / invested) * 100 : 0,
                dayChange: dayChange,
                dayPnl: calcDayPnl(positionValue, dayChange),
                allocation: 0
            };
        }).filter(Boolean);

        const total = rows.reduce((sum, row) => sum + row.positionValue, 0);
        rows.forEach((row) => {
            row.allocation = total > 0 ? (row.positionValue / total) * 100 : 0;
        });
        return rows;
    }

    function filteredRows() {
        const query = state.search.trim().toLowerCase();
        if (!query) return state.rows.slice();
        return state.rows.filter((row) => row.symbol.toLowerCase().includes(query) || row.name.toLowerCase().includes(query));
    }

    function sortedRows(rows) {
        const sorted = rows.slice();
        if (state.sort === 'name') sorted.sort((a, b) => String(a.name).localeCompare(String(b.name)));
        else if (state.sort === 'pnl') sorted.sort((a, b) => b.pnl - a.pnl);
        else if (state.sort === 'change') sorted.sort((a, b) => (toNumber(b.dayChange, -Infinity) - toNumber(a.dayChange, -Infinity)));
        else sorted.sort((a, b) => b.positionValue - a.positionValue);
        return sorted;
    }

    function iconMarkup(row, className) {
        if (row.image) return '<span class="' + className + '"><img src="' + escapeHtml(row.image) + '" alt="' + escapeHtml(row.symbol) + '"></span>';
        const text = row.symbol.length > 4 ? row.symbol.slice(0, 2) : row.symbol.slice(0, 3);
        return '<span class="' + className + '">' + escapeHtml(text) + '</span>';
    }

    function renderSummary(rows) {
        const totalValue = rows.reduce((sum, row) => sum + row.positionValue, 0);
        const invested = rows.reduce((sum, row) => sum + row.invested, 0);
        const unrealized = totalValue - invested;
        const dayPnl = rows.reduce((sum, row) => sum + row.dayPnl, 0);
        const dayBase = totalValue - dayPnl;
        const dayRate = dayBase > 0 ? (dayPnl / dayBase) * 100 : 0;
        const winners = rows.filter((row) => Number.isFinite(row.dayChange) && row.dayChange > 0).length;
        const losers = rows.filter((row) => Number.isFinite(row.dayChange) && row.dayChange < 0).length;
        const volatility = rows.length ? rows.reduce((sum, row) => sum + Math.abs(toNumber(row.dayChange, 0)), 0) / rows.length : 0;

        dom.totalValue.textContent = formatMoney(totalValue);
        dom.dayPnl.textContent = formatSignedMoney(dayPnl);
        dom.dayPnlRate.textContent = formatPercent(dayRate);
        dom.openCount.textContent = String(rows.length);
        dom.openSplit.textContent = interpolate(t('splitLabel'), { wins: winners, losses: losers });
        dom.volatility.textContent = formatPercentUnsigned(volatility);
        dom.marketDepth.textContent = interpolate(t('assetsCount'), { count: rows.length });
        dom.investedValue.textContent = formatMoney(invested);
        dom.currentValue.textContent = formatMoney(totalValue);
        dom.unrealizedValue.textContent = formatSignedMoney(unrealized);
        dom.updatedAt.textContent = state.lastUpdatedAt ? interpolate(t('updatedAt'), { time: formatClock(state.lastUpdatedAt) }) : t('loading');

        applyTone(dom.dayPnl, dayPnl);
        applyTone(dom.dayPnlRate, dayRate);
        applyTone(dom.unrealizedValue, unrealized);
    }

    function renderAllocation(rows) {
        if (!rows.length) {
            dom.allocationList.innerHTML = '<div class="tracker-allocation-item">--</div>';
            return;
        }
        dom.allocationList.innerHTML = rows.slice().sort((a, b) => b.positionValue - a.positionValue).slice(0, 6).map((row) => {
            return '<div class="tracker-allocation-item">'
                + '<div class="tracker-allocation-head"><span>' + escapeHtml(row.name) + ' (' + escapeHtml(row.symbol) + ')</span><span>' + formatPercentUnsigned(row.allocation) + '</span></div>'
                + '<div class="tracker-allocation-meta"><span>' + formatQty(row.qty) + ' ' + escapeHtml(row.symbol) + '</span><span>' + formatMoney(row.positionValue) + '</span></div>'
                + '<div class="tracker-progress"><span style="width:' + Math.max(0, Math.min(100, row.allocation)).toFixed(2) + '%"></span></div>'
                + '</div>';
        }).join('');
    }

    function renderMovers(rows) {
        const ranked = rows.filter((row) => Number.isFinite(row.dayChange)).sort((a, b) => b.dayChange - a.dayChange);
        const merged = ranked.slice(0, 3).map((row) => ({ row: row, side: 'up' })).concat(ranked.slice().reverse().slice(0, 3).map((row) => ({ row: row, side: 'down' })));
        if (!merged.length) {
            dom.moversList.innerHTML = '<div class="tracker-mover-item">--</div>';
            return;
        }

        dom.moversList.innerHTML = merged.map((item) => {
            const row = item.row;
            const isUp = item.side === 'up';
            return '<div class="tracker-mover-item">'
                + '<div class="tracker-mover-main">' + iconMarkup(row, 'tracker-coin-icon') + '<div class="tracker-mover-name"><strong>' + escapeHtml(row.name) + '</strong><span>' + escapeHtml(row.symbol) + '</span></div></div>'
                + '<div class="tracker-mover-side"><b class="' + (row.dayChange >= 0 ? 'tracker-positive' : 'tracker-negative') + '">' + formatPercent(row.dayChange) + '</b><span class="' + (isUp ? 'tracker-pill-up' : 'tracker-pill-down') + '">' + escapeHtml(t(isUp ? 'moverUp' : 'moverDown')) + '</span></div>'
                + '</div>';
        }).join('');
    }

    function renderTable(rows) {
        dom.tableBody.innerHTML = rows.map((row) => {
            const dayTone = row.dayChange >= 0 ? 'tracker-positive' : 'tracker-negative';
            const pnlTone = row.pnl >= 0 ? 'tracker-positive' : 'tracker-negative';
            return '<tr>'
                + '<td>' + iconMarkup(row, 'tracker-coin-icon') + '</td>'
                + '<td><div class="tracker-asset-cell"><div class="tracker-asset-copy"><strong>' + escapeHtml(row.name) + '</strong><span>' + escapeHtml(row.symbol) + '</span></div></div></td>'
                + '<td class="tracker-num">' + formatQty(row.qty) + '</td>'
                + '<td class="tracker-num">' + formatMoney(row.cost) + '</td>'
                + '<td class="tracker-num">' + formatMoney(row.marketPrice) + '</td>'
                + '<td class="tracker-num">' + formatMoney(row.positionValue) + '</td>'
                + '<td class="tracker-num ' + dayTone + '">' + formatPercent(row.dayChange) + '</td>'
                + '<td class="tracker-pnl-cell ' + pnlTone + '"><b>' + formatSignedMoney(row.pnl) + '</b><span>' + formatPercent(row.pnlRate) + '</span></td>'
                + '<td class="tracker-allocation-cell"><strong>' + formatPercentUnsigned(row.allocation) + '</strong><div class="tracker-progress"><span style="width:' + Math.max(0, Math.min(100, row.allocation)).toFixed(2) + '%"></span></div></td>'
                + '</tr>';
        }).join('');
    }

    function render() {
        renderSummary(state.rows);
        renderAllocation(state.rows);
        renderMovers(state.rows);

        const tableRows = sortedRows(filteredRows());
        renderTable(tableRows);

        if (tableRows.length) {
            dom.emptyState.classList.remove('visible');
            dom.emptyState.textContent = '';
            return;
        }

        dom.emptyState.classList.add('visible');
        if (state.isLoading && !state.rows.length) dom.emptyState.textContent = t('loading');
        else if (!state.rows.length) dom.emptyState.textContent = state.errorText || t('noData');
        else dom.emptyState.textContent = t('noMatch');
    }

    function applyI18n() {
        state.lang = getLang();
        dom.searchInput.placeholder = t('searchPlaceholder');
        render();
    }

    async function refreshRows(force) {
        if (state.isLoading && !force) return;
        state.isLoading = true;
        dom.refreshBtn.classList.add('is-loading');
        render();

        try {
            const ids = HOLDINGS.map((item) => item.id);
            const chunks = chunkArray(ids, 45);
            const simpleMap = {};
            for (let i = 0; i < chunks.length; i += 1) {
                const payload = await fetchSimpleChunk(chunks[i]);
                Object.keys(payload || {}).forEach((id) => {
                    simpleMap[id] = payload[id];
                });
            }

            if (Date.now() - state.lastMetaAt > META_REFRESH_MS) {
                fetchMarketMeta().then(() => {
                    state.rows = buildRows(simpleMap);
                    render();
                }).catch(() => { });
            }

            const rows = buildRows(simpleMap);
            if (!rows.length) throw new Error('No tracker rows generated');
            state.rows = rows;
            state.errorText = '';
            state.lastUpdatedAt = Date.now();
        } catch (error) {
            console.warn('Tracker data fetch failed:', error && error.message ? error.message : error);
            state.errorText = t('noData');
        } finally {
            state.isLoading = false;
            dom.refreshBtn.classList.remove('is-loading');
            render();
        }
    }

    function initEvents() {
        dom.searchInput.addEventListener('input', (event) => {
            state.search = String(event.target.value || '');
            render();
        });
        dom.sortSelect.addEventListener('change', (event) => {
            state.sort = String(event.target.value || 'value');
            render();
        });
        dom.refreshBtn.addEventListener('click', () => {
            refreshRows(true);
        });
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) refreshRows(false);
        });
        window.addEventListener('storage', (event) => {
            if (event.key === 'ec_site_lang' || event.key === 'ec_language') applyI18n();
        });
    }

    applyI18n();
    initEvents();
    refreshRows(true);
    window.setInterval(() => refreshRows(false), POLL_MS);
})();
