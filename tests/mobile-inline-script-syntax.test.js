const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');

const mobileHtmlPath = path.join(__dirname, '..', 'mobile.html');

function getInlineScripts(html) {
  const scripts = [];
  const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = scriptRegex.exec(html))) {
    const attrs = match[1] || '';
    if (/\bsrc\s*=/.test(attrs)) continue;

    const fullMatch = match[0];
    const code = match[2];
    const scriptOpenIndex = match.index + fullMatch.indexOf('>') + 1;
    const lineOffset = html.slice(0, scriptOpenIndex).split('\n').length - 1;
    scripts.push({ code, lineOffset, isModule: /\btype\s*=\s*["']module["']/i.test(attrs) });
  }

  return scripts;
}

test('mobile inline scripts parse without syntax errors', () => {
  const html = fs.readFileSync(mobileHtmlPath, 'utf8');
  const inlineScripts = getInlineScripts(html);

  assert.ok(inlineScripts.length > 0, 'expected inline scripts in mobile.html');

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mobile-inline-syntax-'));

  try {
    for (const [index, { code, isModule }] of inlineScripts.entries()) {
      const tempFile = path.join(tempDir, `mobile-inline-script-${index + 1}.${isModule ? 'mjs' : 'js'}`);
      fs.writeFileSync(tempFile, code, 'utf8');

      const result = spawnSync(process.execPath, ['--check', tempFile], {
        encoding: 'utf8',
      });

      assert.equal(
        result.status,
        0,
        `inline ${isModule ? 'module ' : ''}script #${index + 1} should parse successfully:\n${result.stderr || result.stdout}`
      );
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
