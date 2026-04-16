// ── TOTP generation (Web Crypto API) ──────────────────────────────
const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Decode(input) {
  input = input.toUpperCase().replace(/=+$/, '');
  let bits = 0, value = 0;
  const output = [];
  for (const char of input) {
    const idx = BASE32_CHARS.indexOf(char);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) { bits -= 8; output.push((value >> bits) & 0xff); }
  }
  return new Uint8Array(output);
}

async function generateTOTP(base32Secret) {
  const keyBytes = base32Decode(base32Secret);
  const timeStep = Math.floor(Date.now() / 1000 / 30);
  const timeBuffer = new ArrayBuffer(8);
  new DataView(timeBuffer).setUint32(4, timeStep, false);
  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyBytes, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']
  );
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', cryptoKey, timeBuffer));
  const offset = sig[19] & 0xf;
  const code = ((sig[offset] & 0x7f) << 24) | ((sig[offset+1] & 0xff) << 16) |
               ((sig[offset+2] & 0xff) << 8)  |  (sig[offset+3] & 0xff);
  return String(code % 1_000_000).padStart(6, '0');
}

// ── Validity countdown ──
function validitySeconds() {
  const t = Date.now();
  return Math.floor(30 - ((t / 1000) - 30) % 30);
}

// ── State ─────────────────────────────────────────────────────────
let secrets   = [];   // [{key, label}]
let codes     = [];   // [{label, code, validTime}]
let query     = '';
let sortOrder = 'asc';

// ── Persistence ───────────────────────────────────────────────────
function loadConfig() {
  const raw = localStorage.getItem('totp-cfg');
  return raw ? JSON.parse(raw) : [];
}
function saveConfig(jsonString) {
  localStorage.setItem('totp-cfg', jsonString);
}

// ── Code generation ───────────────────────────────────────────────
async function generateCodes() {
  const validTime = validitySeconds();
  codes = await Promise.all(
    secrets.map(async s => ({
      label: s.label,
      code: await generateTOTP(s.key),
      validTime
    }))
  );
}

// ── Sort ──────────────────────────────────────────────────────────
function sortSecrets() {
  secrets.sort((a, b) => {
    const cmp = a.label.localeCompare(b.label);
    return sortOrder === 'asc' ? cmp : -cmp;
  });
}

// ── Helpers ───────────────────────────────────────────────────────
function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escAttr(s) {
  return s.replace(/"/g, '&quot;');
}

// ── Render ────────────────────────────────────────────────────────
const COPY_ICON = `<svg class="material-icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M17.391,2.406H7.266c-0.232,0-0.422,0.19-0.422,0.422v3.797H3.047c-0.232,0-0.422,0.19-0.422,0.422v10.125c0,0.232,0.19,0.422,0.422,0.422h10.125c0.231,0,0.422-0.189,0.422-0.422v-3.797h3.797c0.232,0,0.422-0.19,0.422-0.422V2.828C17.812,2.596,17.623,2.406,17.391,2.406 M12.749,16.75h-9.28V7.469h3.375v5.484c0,0.231,0.19,0.422,0.422,0.422h5.483V16.75zM16.969,12.531H7.688V3.25h9.281V12.531z"/></svg>`;

function render() {
  const filtered = codes.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );
  document.getElementById('table-body').innerHTML = filtered.map(c => `
    <tr>
      <td style="max-width:60%"><h2>${escHtml(c.label)}</h2></td>
      <td style="max-width:20%">
        <div class="card-container">
          <button class="card" data-code="${escAttr(c.code)}">
            <span><h2>${escHtml(c.code)}</h2></span>${COPY_ICON}
          </button>
        </div>
      </td>
      <td style="max-width:20%;text-align:center"><h2>${c.validTime}</h2></td>
    </tr>`).join('');
}

// ── Bootstrap ─────────────────────────────────────────────────────
async function init() {
  secrets = loadConfig();
  sortSecrets();
  await generateCodes();
  render();

  setInterval(async () => {
    await generateCodes();
    render();
  }, 1000);
}

// ── Event listeners ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  await init();

  // Search
  document.getElementById('search').addEventListener('input', e => {
    query = e.target.value;
    render();
  });

  // Sort
  document.getElementById('sort-col').addEventListener('click', async () => {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    sortSecrets();
    await generateCodes();
    render();
  });

  // Clipboard (event delegation on tbody)
  document.getElementById('table-body').addEventListener('click', e => {
    const btn = e.target.closest('[data-code]');
    if (!btn) return;
    const code = btn.dataset.code;
    navigator.clipboard.writeText(code).catch(() => {
      document.getElementById('status').textContent = 'Failed to copy to clipboard';
    });
    document.getElementById('status').textContent = `Copied code ${code} to clipboard`;
  });

  // File load
  document.getElementById('load-btn').addEventListener('click', () => {
    document.getElementById('file-input').click();
  });
  document.getElementById('file-input').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file || (!file.name.endsWith('.json') && file.type !== 'application/json')) return;
    const reader = new FileReader();
    reader.onload = async ev => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!Array.isArray(parsed) || !parsed.every(s => typeof s.key === 'string' && typeof s.label === 'string')) {
          document.getElementById('status').textContent = 'Invalid JSON: expected array of {key, label} objects';
          return;
        }
        saveConfig(ev.target.result);
        secrets = loadConfig();
        sortSecrets();
        await generateCodes();
        render();
      } catch {
        document.getElementById('status').textContent = 'Failed to parse JSON file';
      }
    };
    reader.readAsText(file);
  });
});
