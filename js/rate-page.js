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

    const I18N = {
        en: {
            buySell: 'Buy & Sell',
            rates: 'Rates',
            tracker: 'Tracker',
            learn: 'Learn',
            about: 'About Us',
            signIn: 'Sign In',
            signUp: 'Sign up',
            heroTitle: 'Crypto Live Rates',
            topGainersToday: 'Top Gainers Today',
            topGainersWeek: 'Top Gainers This Week',
            allRates: 'All Rates',
            voteListing: 'Vote for a new listing',
            name: 'Name',
            symbol: 'Symbol',
            sell: 'Sell',
            buy: 'Buy',
            change24h: '24h',
            last48h: 'Last 48 hours',
            loadingRates: 'Loading live rates...',
            noMatchingRates: 'No matching assets found.',
            footerCopy: 'EasyCrypto makes it easier to get into crypto with clear pricing, familiar trading flows, and live market tracking.',
            startHere: 'Start Here',
            ourRates: 'Our Rates',
            portfolioTracker: 'Portfolio Tracker',
            usefulLinks: 'Useful Links',
            getHelp: 'Get Help',
            learnCrypto: 'Learn About Crypto',
            careers: 'Careers',
            terms: 'Terms of Service',
            privacy: 'Privacy Policy',
            rights: 'Copyright 2026 EasyCrypto Exchange. All rights reserved.',
            searchPlaceholder: 'Filter list',
            liveBuy: 'Buy',
            liveSell: 'Sell',
            liveWatch: 'Watch'
        },
        zh: {
            buySell: '买卖',
            rates: '汇率',
            tracker: '行情追踪',
            learn: '学习中心',
            about: '关于我们',
            signIn: '登录',
            signUp: '注册',
            heroTitle: '加密货币实时汇率',
            topGainersToday: '今日涨幅榜',
            topGainersWeek: '本周涨幅榜',
            allRates: '全部汇率',
            voteListing: '投票支持新币上线',
            name: '名称',
            symbol: '代码',
            sell: '卖出',
            buy: '买入',
            change24h: '24小时',
            last48h: '最近48小时',
            loadingRates: '正在加载实时汇率...',
            noMatchingRates: '没有找到匹配的币种。',
            footerCopy: 'EasyCrypto 通过清晰报价、熟悉的交易流程和实时行情追踪，让用户更容易进入加密市场。',
            startHere: '开始使用',
            ourRates: '平台汇率',
            portfolioTracker: '资产追踪',
            usefulLinks: '常用链接',
            getHelp: '获取帮助',
            learnCrypto: '学习加密货币',
            careers: '加入我们',
            terms: '服务条款',
            privacy: '隐私政策',
            rights: 'Copyright 2026 EasyCrypto Exchange. All rights reserved.',
            searchPlaceholder: '筛选列表',
            liveBuy: '买入',
            liveSell: '卖出',
            liveWatch: '观察'
        },
        de: {
            buySell: 'Kaufen & Verkaufen',
            rates: 'Kurse',
            tracker: 'Markt-Tracker',
            learn: 'Lernen',
            about: 'Uber uns',
            signIn: 'Anmelden',
            signUp: 'Registrieren',
            heroTitle: 'Krypto Live-Kurse',
            topGainersToday: 'Top-Gewinner heute',
            topGainersWeek: 'Top-Gewinner diese Woche',
            allRates: 'Alle Kurse',
            voteListing: 'Fur ein neues Listing abstimmen',
            name: 'Name',
            symbol: 'Symbol',
            sell: 'Verkauf',
            buy: 'Kauf',
            change24h: '24h',
            last48h: 'Letzte 48 Stunden',
            loadingRates: 'Live-Kurse werden geladen...',
            noMatchingRates: 'Keine passenden Assets gefunden.',
            footerCopy: 'EasyCrypto macht den Einstieg in Krypto einfacher - mit klaren Preisen, vertrauten Ablaufen und live aktualisierten Marktdaten.',
            startHere: 'Erste Schritte',
            ourRates: 'Unsere Kurse',
            portfolioTracker: 'Portfolio-Tracker',
            usefulLinks: 'Nutzliche Links',
            getHelp: 'Hilfe',
            learnCrypto: 'Mehr uber Krypto',
            careers: 'Karriere',
            terms: 'Nutzungsbedingungen',
            privacy: 'Datenschutz',
            rights: 'Copyright 2026 EasyCrypto Exchange. Alle Rechte vorbehalten.',
            searchPlaceholder: 'Liste filtern',
            liveBuy: 'Kaufen',
            liveSell: 'Verkaufen',
            liveWatch: 'Beobachten'
        },
        ja: {
            buySell: '売買',
            rates: 'レート',
            tracker: 'トラッカー',
            learn: '学ぶ',
            about: '会社概要',
            signIn: 'ログイン',
            signUp: '登録',
            heroTitle: '暗号資産ライブレート',
            topGainersToday: '本日の上昇率',
            topGainersWeek: '今週の上昇率',
            allRates: '全レート',
            voteListing: '新規上場の投票を受付中',
            name: '名称',
            symbol: 'シンボル',
            sell: '売値',
            buy: '買値',
            change24h: '24時間',
            last48h: '直近48時間',
            loadingRates: 'ライブレートを読み込み中...',
            noMatchingRates: '一致する銘柄がありません。',
            footerCopy: 'EasyCrypto は明確な価格、使い慣れた取引フロー、リアルタイム相場で暗号資産への参加を簡単にします。',
            startHere: 'スタート',
            ourRates: 'レート',
            portfolioTracker: 'ポートフォリオ',
            usefulLinks: '便利なリンク',
            getHelp: 'ヘルプ',
            learnCrypto: '暗号資産を学ぶ',
            careers: '採用情報',
            terms: '利用規約',
            privacy: 'プライバシー',
            rights: 'Copyright 2026 EasyCrypto Exchange. All rights reserved.',
            searchPlaceholder: '一覧を検索',
            liveBuy: '買い',
            liveSell: '売り',
            liveWatch: '監視'
        },
        ko: {
            buySell: '매수/매도',
            rates: '시세',
            tracker: '트래커',
            learn: '학습',
            about: '회사 소개',
            signIn: '로그인',
            signUp: '회원가입',
            heroTitle: '암호화폐 실시간 시세',
            topGainersToday: '오늘의 상승 종목',
            topGainersWeek: '이번 주 상승 종목',
            allRates: '전체 시세',
            voteListing: '신규 상장 투표',
            name: '이름',
            symbol: '심볼',
            sell: '매도',
            buy: '매수',
            change24h: '24시간',
            last48h: '최근 48시간',
            loadingRates: '실시간 시세를 불러오는 중...',
            noMatchingRates: '일치하는 종목이 없습니다.',
            footerCopy: 'EasyCrypto 는 명확한 가격, 익숙한 거래 흐름, 실시간 시장 추적으로 암호화폐 진입을 더 쉽게 만듭니다.',
            startHere: '시작하기',
            ourRates: '시세 보기',
            portfolioTracker: '포트폴리오',
            usefulLinks: '유용한 링크',
            getHelp: '도움말',
            learnCrypto: '암호화폐 배우기',
            careers: '채용',
            terms: '이용약관',
            privacy: '개인정보 처리방침',
            rights: 'Copyright 2026 EasyCrypto Exchange. All rights reserved.',
            searchPlaceholder: '목록 검색',
            liveBuy: '매수',
            liveSell: '매도',
            liveWatch: '관망'
        }
    };

    const BRIDGE_POLL_MS = 2000;
    const GECKO_REFRESH_MS = 120000;
    const PRICE_SPREAD_RATE = 0.005;
    const DEFAULT_LANG = 'en';
    const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
    const COINGECKO_DEMO_KEY = String(window.EC_COINGECKO_DEMO_KEY || localStorage.getItem('ec_coingecko_demo_key') || '').trim();

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

    if (!dom.bridge || !dom.todayList || !dom.weekList || !dom.tableBody || !dom.emptyState) {
        return;
    }

    const state = {
        quoteCurrency: 'USD',
        search: '',
        currentLang: DEFAULT_LANG,
        liveStore: {},
        geckoMeta: {},
        liveReady: false
    };

    function normalizeLang(value) {
        const raw = String(value || '').trim();
        if (!raw) return DEFAULT_LANG;
        if (I18N[raw]) return raw;
        const lowered = raw.toLowerCase();
        if (I18N[lowered]) return lowered;
        if (lowered === 'english') return 'en';
        if (lowered === 'deutsch') return 'de';
        if (lowered === '中文') return 'zh';
        if (lowered === '日本語') return 'ja';
        if (lowered === '한국어') return 'ko';
        return DEFAULT_LANG;
    }

    function getCurrentLang() {
        if (typeof window.ecGetSiteLanguage === 'function') {
            return normalizeLang(window.ecGetSiteLanguage());
        }

        const stored = localStorage.getItem('ec_site_lang') || localStorage.getItem('ec_language');
        return normalizeLang(stored);
    }

    function getCopy(key) {
        const dict = I18N[state.currentLang] || I18N.en;
        return dict[key] || I18N.en[key] || key;
    }

    function applyStaticCopy() {
        state.currentLang = getCurrentLang();

        document.querySelectorAll('[data-rate-i18n]').forEach((node) => {
            const key = node.getAttribute('data-rate-i18n');
            node.textContent = getCopy(key);
        });

        if (dom.searchInput) {
            dom.searchInput.placeholder = getCopy('searchPlaceholder');
        }
        if (dom.usdLabel) {
            dom.usdLabel.textContent = state.quoteCurrency;
        }
        document.title = getCopy('heroTitle') + ' - EASYCRYPTO';
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
        let minimumFractionDigits = 2;
        let maximumFractionDigits = 2;
        if (value < 1) {
            minimumFractionDigits = 4;
            maximumFractionDigits = 6;
        } else if (value < 100) {
            minimumFractionDigits = 2;
            maximumFractionDigits = 4;
        }

        return '$' + new Intl.NumberFormat('en-US', {
            minimumFractionDigits,
            maximumFractionDigits
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

    function getRecordForSymbol(symbol) {
        const quote = state.quoteCurrency;
        const candidates = quote === 'USD'
            ? [symbol + '/USD', symbol + '/USDT']
            : [symbol + '/USDT', symbol + '/USD'];

        for (let i = 0; i < candidates.length; i += 1) {
            const candidate = state.liveStore[candidates[i]];
            if (candidate && Number(candidate.price || 0) > 0) {
                return candidate;
            }
        }

        return null;
    }

    function deriveWeekChange(dayChange) {
        if (!Number.isFinite(dayChange)) return 0;
        const derived = (dayChange * 2.35) + Math.sign(dayChange || 1) * 4.5;
        return Math.max(-95, Math.min(220, derived));
    }

    function getDataset() {
        return RATE_UNIVERSE.map((coin) => {
            const live = getRecordForSymbol(coin.symbol) || {};
            const meta = coin.id ? (state.geckoMeta[coin.id] || {}) : {};
            const price = Number(live.price || meta.currentPrice || 0);
            const dayChange = Number.isFinite(Number(live.change))
                ? Number(live.change)
                : (Number.isFinite(Number(meta.dayChange)) ? Number(meta.dayChange) : NaN);
            const weekChange = Number.isFinite(Number(meta.weekChange))
                ? Number(meta.weekChange)
                : deriveWeekChange(dayChange);
            const volume = Number(live.volume || meta.volume || 0);

            return {
                symbol: coin.symbol,
                name: meta.name || coin.name,
                id: coin.id,
                accent: coin.accent || 'blue',
                image: meta.image || '',
                price,
                dayChange,
                weekChange,
                volume
            };
        }).filter((coin) => coin.price > 0 || coin.image || Number.isFinite(coin.dayChange));
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
        const count = 11;
        const values = [];
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
        const width = 132;
        const height = 36;

        return values.map((value, index) => {
            const x = (index / (count - 1)) * width;
            const y = height - (((value - min) / range) * (height - 6)) - 3;
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
            const sparkClass = 'rate-sparkline ' + tone;

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
                '      <svg class="' + sparkClass + '" viewBox="0 0 132 36" aria-hidden="true">' +
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
        renderTopList(dom.todayList, dataset, 'dayChange');
        renderTopList(dom.weekList, dataset, 'weekChange');

        const filteredRows = getFilteredDataset();
        renderTable(filteredRows);

        const isLoading = !state.liveReady && dataset.length === 0;
        if (filteredRows.length === 0) {
            dom.emptyState.classList.add('visible');
            dom.emptyState.textContent = isLoading ? getCopy('loadingRates') : getCopy('noMatchingRates');
        } else {
            dom.emptyState.classList.remove('visible');
            dom.emptyState.textContent = '';
        }
    }

    function readBridgeStore() {
        try {
            if (!dom.bridge.contentWindow || !dom.bridge.contentWindow.marketDataStore) {
                return null;
            }
            return dom.bridge.contentWindow.marketDataStore;
        } catch (error) {
            console.warn('Rate page bridge access failed:', error);
            return null;
        }
    }

    function pollBridge() {
        const store = readBridgeStore();
        if (!store) {
            render();
            return;
        }

        state.liveStore = store;
        state.liveReady = Object.keys(store).length > 0;
        render();
    }

    async function fetchCoinGeckoMeta() {
        const ids = RATE_UNIVERSE.map((coin) => coin.id).filter(Boolean);
        if (ids.length === 0) return;

        const params = new URLSearchParams({
            vs_currency: 'usd',
            ids: ids.join(','),
            order: 'market_cap_desc',
            per_page: String(ids.length),
            page: '1',
            sparkline: 'false',
            price_change_percentage: '24h,7d',
            locale: 'en'
        });

        const headers = { accept: 'application/json' };
        if (COINGECKO_DEMO_KEY) {
            headers['x-cg-demo-api-key'] = COINGECKO_DEMO_KEY;
        }

        try {
            const response = await fetch(COINGECKO_BASE_URL + '/coins/markets?' + params.toString(), { headers });
            if (!response.ok) {
                throw new Error('CoinGecko HTTP ' + response.status);
            }

            const payload = await response.json();
            const nextMeta = {};
            payload.forEach((item) => {
                if (!item || !item.id) return;
                nextMeta[item.id] = {
                    name: item.name,
                    image: item.image,
                    currentPrice: Number(item.current_price || 0),
                    dayChange: Number(item.price_change_percentage_24h_in_currency || item.price_change_percentage_24h || 0),
                    weekChange: Number(item.price_change_percentage_7d_in_currency || 0),
                    volume: Number(item.total_volume || 0)
                };
            });

            state.geckoMeta = nextMeta;
            render();
        } catch (error) {
            console.warn('Rate page CoinGecko fetch failed:', error);
            render();
        }
    }

    function syncToggleState() {
        if (!dom.usdToggle) return;
        dom.usdToggle.checked = state.quoteCurrency === 'USD';
        if (dom.usdLabel) {
            dom.usdLabel.textContent = state.quoteCurrency;
        }
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

        dom.bridge.addEventListener('load', pollBridge);
        document.addEventListener('ec-language-changed', () => {
            applyStaticCopy();
            render();
        });
    }

    function startPolling() {
        window.setInterval(pollBridge, BRIDGE_POLL_MS);
        window.setInterval(fetchCoinGeckoMeta, GECKO_REFRESH_MS);
    }

    applyStaticCopy();
    syncToggleState();
    attachEvents();
    render();
    pollBridge();
    fetchCoinGeckoMeta();
    startPolling();
})();
