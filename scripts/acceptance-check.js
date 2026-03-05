/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const { chromium } = require("playwright-core");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const DEFAULT_PORT = Number(process.env.EC_ACCEPT_PORT || 8095);
const BASE_URL = process.env.EC_ACCEPT_BASE_URL || `http://127.0.0.1:${DEFAULT_PORT}`;

function fileExists(p) {
  try {
    return fs.existsSync(p);
  } catch (e) {
    return false;
  }
}

function findChromeExecutable() {
  const fromEnv = process.env.CHROME_EXECUTABLE;
  const candidates = [
    fromEnv,
    path.resolve(PROJECT_ROOT, "..", "chrome-win64", "chrome-win64", "chrome.exe"),
    path.resolve(PROJECT_ROOT, "..", "chrome-win64", "chrome.exe"),
    path.resolve("G:/works/AdminecmainPRO/chrome-win64/chrome-win64/chrome.exe"),
    path.resolve("C:/Program Files/Google/Chrome/Application/chrome.exe")
  ].filter(Boolean);

  for (const p of candidates) {
    if (fileExists(p)) return p;
  }

  throw new Error(
    "Chrome executable not found. Set CHROME_EXECUTABLE or put chrome.exe under ../chrome-win64/chrome-win64/"
  );
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForServerReady(baseUrl, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${baseUrl}/index.html`, { method: "GET" });
      if (res.ok) return;
    } catch (e) {
      // retry
    }
    await sleep(300);
  }
  throw new Error(`Server not ready within ${timeoutMs}ms: ${baseUrl}`);
}

function startStaticServer(port) {
  const child = spawn("python", ["-m", "http.server", String(port)], {
    cwd: PROJECT_ROOT,
    stdio: "ignore",
    windowsHide: true
  });
  return child;
}

function parseNumberish(text) {
  if (!text) return NaN;
  const t = String(text).trim();
  if (!t || t === "--") return NaN;

  const unit = t.endsWith("B") ? 1e9 : t.endsWith("M") ? 1e6 : t.endsWith("K") ? 1e3 : 1;
  const cleaned = t.replace(/[$,%~+\s]|Volume|USDT|USD|,/gi, "").replace(/[KMB]$/i, "");
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return NaN;
  return n * unit;
}

async function hasNonZeroData(page, selector, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const values = await page.$$eval(selector, (els) =>
      els.slice(0, 20).map((el) => (el.textContent || "").replace(/\s+/g, " ").trim())
    );
    const ok = values.some((v) => {
      const n = Number(String(v).replace(/[$,%~+\s,]/g, ""));
      return Number.isFinite(n) && n !== 0;
    });
    if (ok) return true;
    await page.waitForTimeout(1000);
  }
  return false;
}

async function hasMobileLocalData(page, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const ok = await page
      .evaluate(() => {
        if (!window.localData || typeof window.localData !== "object") return false;
        const values = Object.values(window.localData);
        if (!values.length) return false;
        return values.some((item) => {
          if (!item || typeof item !== "object") return false;
          const p = Number(item.price);
          return Number.isFinite(p) && p > 0;
        });
      })
      .catch(() => false);

    if (ok) return true;
    await page.waitForTimeout(800);
  }
  return false;
}

async function checkLanguageSwitch(page) {
  const hasLangApi = await page.evaluate(() => typeof window.ecSetSiteLanguage === "function");
  if (!hasLangApi) return { ok: false, reason: "window.ecSetSiteLanguage missing" };

  await page.evaluate(() => window.ecSetSiteLanguage("zh"));
  await page.waitForTimeout(1200);
  const zhLang = await page.evaluate(() => document.documentElement.lang || "");

  await page.evaluate(() => window.ecSetSiteLanguage("de"));
  await page.waitForTimeout(1200);
  const deLang = await page.evaluate(() => document.documentElement.lang || "");

  const ok = zhLang.toLowerCase().startsWith("zh") && deLang.toLowerCase().startsWith("de");
  return { ok, reason: ok ? "" : `lang mismatch zh=${zhLang} de=${deLang}` };
}

async function checkPlaceholderLinkAction(page) {
  const prepared = await page.evaluate(() => {
    const links = Array.from(
      document.querySelectorAll("a[href='#'],a[href=''],a[href='javascript:void(0)']")
    ).filter((el) => !el.getAttribute("onclick"));
    const target = links.find((el) => {
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return false;
      const cs = window.getComputedStyle(el);
      return cs.display !== "none" && cs.visibility !== "hidden";
    });
    if (!target) return false;
    target.setAttribute("data-ec-accept-link", "1");
    return true;
  });

  if (!prepared) return { ok: true, reason: "no eligible placeholder link" };

  const before = page.url();
  await page.click("[data-ec-accept-link='1']");
  await page.waitForTimeout(900);

  const after = page.url();
  if (after !== before) return { ok: true, reason: "navigated" };

  const toastVisible = await page
    .locator("#ec-ux-toast")
    .evaluateAll((els) =>
      els.some((el) => {
        const cls = el.getAttribute("class") || "";
        return cls.includes("show");
      })
    )
    .catch(() => false);

  if (toastVisible) return { ok: true, reason: "toast shown" };
  return { ok: false, reason: "no navigation and no toast" };
}

async function checkMarketsMultilangInteractions(page) {
  const result = await page
    .evaluate(async () => {
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const fail = (reason) => ({ ok: false, reason });

      if (typeof window.ecSetSiteLanguage !== "function") {
        return fail("window.ecSetSiteLanguage missing");
      }

      const marketTabs = ["all", "spot", "perpetual", "delivery"];
      const sidebarTabs = ["gainers", "losers", "volume"];

      for (const lang of ["zh", "de"]) {
        window.ecSetSiteLanguage(lang);
        await sleep(1000);

        for (const key of marketTabs) {
          const tab = document.querySelector(`.tab-item[data-market-tab="${key}"]`);
          if (!tab) return fail(`${lang}: missing market tab ${key}`);
          tab.click();
          await sleep(280);

          const rows = document.querySelectorAll("#market-tbody tr").length;
          const pageCount = document.querySelectorAll("#market-pagination .pg-item").length;
          const labelCount = document.querySelectorAll("#market-tbody .coin-type-label").length;

          const expectedPages = key === "all" ? 8 : 3;
          if (pageCount !== expectedPages) {
            return fail(`${lang}:${key} pagination ${pageCount}, expected ${expectedPages}`);
          }
          if (rows < 1) return fail(`${lang}:${key} has no rows`);
          if (key !== "all" && labelCount < 1) return fail(`${lang}:${key} lost coin labels`);
        }

        for (const key of sidebarTabs) {
          const tab = document.querySelector(`.s-tab-item[data-sidebar-tab="${key}"]`);
          if (!tab) return fail(`${lang}: missing sidebar tab ${key}`);
          tab.click();
          await sleep(220);
          const rows = document.querySelectorAll("#sidebar-tbody tr").length;
          if (rows < 1) return fail(`${lang}: sidebar ${key} has no rows`);
        }
      }

      return { ok: true, reason: "markets tabs work in zh/de" };
    })
    .catch((err) => ({ ok: false, reason: err.message }));

  return result;
}

async function checkMobileAuthSubTabs(page) {
  const result = await page
    .evaluate(async () => {
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const fail = (reason) => ({ ok: false, reason });

      if (typeof window.ecSetSiteLanguage !== "function") {
        return fail("window.ecSetSiteLanguage missing");
      }
      if (typeof window.switchLoginTab !== "function" || typeof window.switchSignupTab !== "function") {
        return fail("auth tab switch functions missing");
      }

      for (const lang of ["zh", "de"]) {
        window.ecSetSiteLanguage(lang);
        await sleep(900);

        window.switchLoginTab("mobile");
        await sleep(120);
        const loginMobile = document.querySelector(".login-sub-tab[data-auth-tab='mobile']");
        if (!loginMobile || !loginMobile.classList.contains("active")) {
          return fail(`${lang}: login mobile tab not active`);
        }

        window.switchLoginTab("email");
        await sleep(120);
        const loginEmail = document.querySelector(".login-sub-tab[data-auth-tab='email']");
        if (!loginEmail || !loginEmail.classList.contains("active")) {
          return fail(`${lang}: login email tab not active`);
        }

        window.switchSignupTab("mobile");
        await sleep(120);
        const signupMobile = document.querySelector(".signup-tab-item[data-auth-tab='mobile']");
        if (!signupMobile || !signupMobile.classList.contains("active")) {
          return fail(`${lang}: signup mobile tab not active`);
        }

        window.switchSignupTab("email");
        await sleep(120);
        const signupEmail = document.querySelector(".signup-tab-item[data-auth-tab='email']");
        if (!signupEmail || !signupEmail.classList.contains("active")) {
          return fail(`${lang}: signup email tab not active`);
        }
      }

      return { ok: true, reason: "mobile auth tabs work in zh/de" };
    })
    .catch((err) => ({ ok: false, reason: err.message }));

  return result;
}

async function checkMobileCoreScreenRouting(page) {
  const result = await page
    .evaluate(async () => {
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const fail = (reason) => ({ ok: false, reason });
      if (typeof window.showScreen !== "function") {
        return fail("window.showScreen missing");
      }

      // Routing must work for profile-side pages even before login state.
      const mustRouteTargets = [
        "profile",
        "supportScreen",
        "helpCenterScreen",
        "questionDetailsScreen",
        "aboutUsScreen",
        "privacyPolicyScreen",
        "termsOfServiceScreen"
      ];

      window.kycGateActive = false;
      for (const target of mustRouteTargets) {
        window.showScreen(target, false);
        await sleep(120);
        const targetEl =
          document.getElementById(`${target}-screen`) || document.getElementById(target);
        if (!targetEl || targetEl.classList.contains("hidden")) {
          return fail(`target not visible after routing: ${target}`);
        }
      }

      // KYC is now soft-gate: browsing routes stay accessible.
      window.kycGateActive = true;
      window.showScreen("market", false);
      await sleep(120);
      const marketScreen = document.getElementById("market-screen");
      if (!marketScreen || marketScreen.classList.contains("hidden")) {
        return fail("kyc soft gate should still allow market screen");
      }

      return { ok: true, reason: "mobile screen routing and KYC soft gate ok" };
    })
    .catch((err) => ({ ok: false, reason: err.message }));

  return result;
}

async function checkTopbarActionsMultilang(page, pagePath, actions) {
  for (const lang of ["zh", "de"]) {
    await page.evaluate((l) => {
      if (typeof window.ecSetSiteLanguage === "function") window.ecSetSiteLanguage(l);
    }, lang);
    await page.waitForTimeout(900);

    for (const action of actions) {
      const selector = `[data-topbar-action='${action.key}']`;
      const count = await page.locator(selector).count();
      if (count < 1) continue;

      const before = page.url();
      await page.locator(selector).first().click({ timeout: 4000 });
      await page.waitForTimeout(1000);
      const after = page.url();

      if (after === before) {
        return { ok: false, reason: `${lang}:${action.key} click did not navigate` };
      }

      await page.goto(`${BASE_URL}${pagePath}`, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(900);
    }
  }

  return { ok: true, reason: "topbar actions route in zh/de" };
}

async function runPageChecks(browser, item) {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
  });

  const report = {
    page: item.name,
    load: false,
    lang: { ok: false, reason: "" },
    api: { ok: true, reason: "not configured" },
    placeholder: { ok: true, reason: "not configured" },
    interaction: { ok: true, reason: "not configured" },
    errors
  };

  await page.goto(`${BASE_URL}${item.path}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(1600);
  report.load = true;

  report.lang = await checkLanguageSwitch(page);

  if (item.guardRedirect) {
    const currentPath = new URL(page.url()).pathname.split("/").pop().toLowerCase();
    const expectedGuardPath = String(item.guardRedirect).toLowerCase();
    if (currentPath === expectedGuardPath) {
      report.api = { ok: true, reason: `guard redirected to ${expectedGuardPath}` };
      report.placeholder = { ok: true, reason: "skipped due auth/KYC guard redirect" };
      report.interaction = { ok: true, reason: "skipped due auth/KYC guard redirect" };
      await page.close();
      return report;
    }
  }

  if (typeof item.apiCheck === "function") {
    const custom = await item.apiCheck(page);
    if (typeof custom === "boolean") {
      report.api = { ok: custom, reason: custom ? "custom check passed" : "custom check failed" };
    } else {
      report.api = {
        ok: !!(custom && custom.ok),
        reason: (custom && custom.reason) || (custom && custom.ok ? "custom check passed" : "custom check failed")
      };
    }
  } else if (item.apiSelector) {
    const ok = await hasNonZeroData(page, item.apiSelector, item.apiTimeoutMs || 18000);
    report.api = { ok, reason: ok ? "has non-zero data" : `no non-zero data from ${item.apiSelector}` };
  }

  if (typeof item.interactionCheck === "function") {
    const custom = await item.interactionCheck(page, item);
    if (typeof custom === "boolean") {
      report.interaction = {
        ok: custom,
        reason: custom ? "interaction check passed" : "interaction check failed"
      };
    } else {
      report.interaction = {
        ok: !!(custom && custom.ok),
        reason:
          (custom && custom.reason) ||
          (custom && custom.ok ? "interaction check passed" : "interaction check failed")
      };
    }
  }

  if (item.checkPlaceholder) {
    report.placeholder = await checkPlaceholderLinkAction(page);
  }

  await page.close();
  return report;
}

function printReport(results) {
  let failed = 0;
  console.log("\n=== Auto Acceptance Report ===");
  for (const r of results) {
    const checks = [
      ["load", r.load],
      ["lang", r.lang.ok],
      ["api", r.api.ok],
      ["placeholder", r.placeholder.ok],
      ["interaction", r.interaction.ok]
    ];
    const isFail = checks.some((x) => !x[1]);
    if (isFail) failed += 1;
    console.log(`\n[${isFail ? "FAIL" : "PASS"}] ${r.page}`);
    console.log(`  load: ${r.load}`);
    console.log(`  lang: ${r.lang.ok}${r.lang.reason ? ` (${r.lang.reason})` : ""}`);
    console.log(`  api: ${r.api.ok}${r.api.reason ? ` (${r.api.reason})` : ""}`);
    console.log(
      `  placeholder: ${r.placeholder.ok}${r.placeholder.reason ? ` (${r.placeholder.reason})` : ""}`
    );
    console.log(
      `  interaction: ${r.interaction.ok}${r.interaction.reason ? ` (${r.interaction.reason})` : ""}`
    );
    if (r.errors.length) {
      console.log("  errors:");
      for (const e of r.errors.slice(0, 5)) console.log(`    - ${e}`);
      if (r.errors.length > 5) console.log(`    - ... +${r.errors.length - 5} more`);
    }
  }
  console.log(`\nSummary: ${results.length - failed}/${results.length} pages passed`);
  return failed;
}

async function main() {
  const chromePath = findChromeExecutable();
  console.log(`[accept] chrome: ${chromePath}`);
  console.log(`[accept] baseUrl: ${BASE_URL}`);

  const server = startStaticServer(DEFAULT_PORT);
  let browser;
  try {
    await waitForServerReady(BASE_URL, 15000);

    browser = await chromium.launch({
      executablePath: chromePath,
      headless: true,
      args: ["--disable-dev-shm-usage", "--no-first-run", "--no-default-browser-check"]
    });

    const plan = [
      { name: "index", path: "/index.html", checkPlaceholder: true },
      {
        name: "markets",
        path: "/markets.html",
        apiSelector: ".price-text[data-field='price']",
        apiTimeoutMs: 26000,
        checkPlaceholder: true,
        interactionCheck: checkMarketsMultilangInteractions
      },
      {
        name: "mobile",
        path: "/mobile.html",
        checkPlaceholder: false,
        interactionCheck: async (page) => {
          const authTabs = await checkMobileAuthSubTabs(page);
          if (!authTabs.ok) return authTabs;
          const routing = await checkMobileCoreScreenRouting(page);
          if (!routing.ok) return routing;
          return { ok: true, reason: "mobile auth tabs and routing work in zh/de" };
        },
        apiCheck: async (page) => {
          const ok = await hasMobileLocalData(page, 22000);
          return {
            ok,
            reason: ok ? "local market cache ready" : "mobile local cache has no positive price"
          };
        }
      },
      {
        name: "delivery_chart",
        path: "/delivery_chart.html",
        apiSelector: ".price-cell",
        checkPlaceholder: false,
        guardRedirect: "login.html"
      },
      { name: "login", path: "/login.html", checkPlaceholder: true },
      {
        name: "contract",
        path: "/contract.html",
        checkPlaceholder: false,
        guardRedirect: "login.html",
        interactionCheck: async (page, item) =>
          checkTopbarActionsMultilang(page, item.path, [
            { key: "deposit" },
            { key: "wallet" },
            { key: "order" }
          ])
      }
    ];

    const results = [];
    for (const item of plan) {
      results.push(await runPageChecks(browser, item));
    }

    const failed = printReport(results);
    process.exitCode = failed > 0 ? 1 : 0;
  } finally {
    if (browser) await browser.close().catch(() => {});
    if (server && !server.killed) server.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error("[accept] fatal:", err.message);
  process.exitCode = 1;
});
