const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
const outputDir = path.join(__dirname, 'screenshots');
fs.mkdirSync(outputDir, { recursive: true });

const chromePaths = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
].filter(Boolean);
const chrome = chromePaths.find(candidate => fs.existsSync(candidate));
if (!chrome) throw new Error('Chrome or Edge was not found. Set CHROME_PATH to the browser executable.');

async function request(method, route, body) {
  const url = `${baseUrl}${route}`;
  const response = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await response.text();
  let json;
  try { json = JSON.parse(text); } catch { json = text; }
  return { method, url, status: response.status, statusText: response.statusText, body: json };
}

function escapeHtml(value) {
  return String(value).replace(/[&<>]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[character]);
}

function pageHtml(result, title) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
<style>body{margin:0;background:#f4f6f8;font-family:Segoe UI,Arial,sans-serif;color:#172b4d}.bar{height:14px;background:#ff6c37}.card{width:1280px;margin:22px auto;background:white;border-radius:10px;box-shadow:0 4px 18px #cbd5e1;overflow:hidden}.header{padding:18px 24px;border-bottom:1px solid #dfe3e8}.header h1{font-size:24px;margin:0 0 14px}.request{display:flex;align-items:center;gap:12px}.method{background:#097bed;color:white;font-weight:bold;border-radius:5px;padding:9px 14px}.url{flex:1;background:#f7f8fa;border:1px solid #dfe3e8;border-radius:5px;padding:9px 12px;font-family:Consolas,monospace;font-size:15px}.status{color:#137333;font-weight:bold;font-size:16px}.body{padding:22px 24px}pre{margin:0;background:#101828;color:#ecfdf3;border-radius:8px;padding:20px;font-size:14px;line-height:1.45;overflow:hidden;max-height:650px}</style></head>
<body><div class="bar"></div><main class="card"><div class="header"><h1>${escapeHtml(title)}</h1><div class="request"><span class="method">${result.method}</span><span class="url">${escapeHtml(result.url)}</span><span class="status">${result.status} ${escapeHtml(result.statusText)}</span></div></div><div class="body"><pre>${escapeHtml(JSON.stringify(result.body, null, 2))}</pre></div></main></body></html>`;
}

async function main() {
  const created = await request('POST', '/api/notes', {
    title: 'Project meeting reminder',
    content: 'Discuss the project meeting, deadlines and weekly progress with the team.',
    category: 'Work',
    tags: ['meeting', 'project']
  });
  const mainId = created.body._id || created.body.data?._id || created.body.note?._id;
  if (!mainId) throw new Error(`Could not obtain created note ID: ${JSON.stringify(created.body)}`);

  const tests = [
    ['01-post-create.png', '01. Create Note (POST)', created],
    ['02-get-all.png', '02. Fetch All Notes (GET)', await request('GET', '/api/notes')],
    ['03-pagination.png', '03. Pagination (GET)', await request('GET', '/api/notes?page=1&limit=2')],
    ['04-sort-newest-first.png', '04. Sort Newest First (GET)', await request('GET', '/api/notes?sort=-createdAt')],
    ['05-search-meeting.png', '05. Full-text Search (GET)', await request('GET', '/api/notes?q=meeting')],
    ['06-category-work.png', '06. Category Filter (GET)', await request('GET', '/api/notes?category=Work')],
    ['07-get-one.png', '07. Fetch One Note (GET)', await request('GET', `/api/notes/${mainId}`)],
    ['08-put-update.png', '08. Update Note (PUT)', await request('PUT', `/api/notes/${mainId}`, { title: 'Updated project meeting reminder', content: 'Updated meeting agenda, deadlines, progress and action items.', category: 'Work', tags: ['meeting', 'updated'] })]
  ];

  const deleteCreated = await request('POST', '/api/notes', {
    title: 'Delete evidence note', content: 'Temporary note used to demonstrate deletion.', category: 'Personal'
  });
  const deleteId = deleteCreated.body._id || deleteCreated.body.data?._id || deleteCreated.body.note?._id;
  if (!deleteId) throw new Error(`Could not obtain delete note ID: ${JSON.stringify(deleteCreated.body)}`);
  tests.push(['09-delete.png', '09. Delete Note (DELETE)', await request('DELETE', `/api/notes/${deleteId}`)]);

  for (const [filename, title, result] of tests) {
    if (result.status >= 400) throw new Error(`${title} failed with ${result.status}: ${JSON.stringify(result.body)}`);
    const htmlPath = path.join(outputDir, `.evidence-${filename}.html`);
    const pngPath = path.join(outputDir, filename);
    fs.writeFileSync(htmlPath, pageHtml(result, title));
    const command = spawnSync(chrome, [
      '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
      `--window-size=1400,900`, `--screenshot=${pngPath}`, `file:///C:/Users/User/personal-notes-api/evidence/screenshots/${path.basename(htmlPath)}`
    ], { encoding: 'utf8', timeout: 30000 });
    fs.unlinkSync(htmlPath);
    if (command.status !== 0) throw new Error(`Screenshot failed for ${filename}: ${command.stderr}`);
    console.log(`Captured ${filename}`);
  }
}

main().catch(error => { console.error(error); process.exit(1); });
