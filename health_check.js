const http = require('http');

const BASE = 'http://localhost:5173';

function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const opts = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: 10000
    };
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data, size: data.length }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function run() {
  console.log('=== VATANUZ.UZ SITE HEALTH CHECK ===\n');
  let passed = 0, failed = 0;

  // 1. Homepage
  console.log('--- 1. ASOSIY SAHIFA ---');
  try {
    const r = await request(BASE + '/');
    if (r.status === 200 && r.size > 500) {
      console.log('  OK  | Asosiy sahifa yuklandi (' + r.size + ' bytes)');
      passed++;
    } else {
      console.log('  XATO | Status: ' + r.status + ', Size: ' + r.size);
      failed++;
    }
  } catch (e) { console.log('  XATO | ' + e.message); failed++; }

  // 2. Static files
  console.log('\n--- 2. STATIK FAYLLAR ---');
  const statics = ['/styles.css', '/app.jsx', '/manifest.json', '/sw.js'];
  for (const s of statics) {
    try {
      const r = await request(BASE + s);
      if (r.status === 200) {
        console.log('  OK  | ' + s + ' (' + r.size + ' bytes)');
        passed++;
      } else {
        console.log('  XATO | ' + s + ' Status: ' + r.status);
        failed++;
      }
    } catch (e) { console.log('  XATO | ' + s + ' ' + e.message); failed++; }
  }

  // 3. Public API
  console.log('\n--- 3. OMMAVIY API ---');
  const publicApis = [
    '/api/categories', '/api/languages', '/api/translations',
    '/api/pages', '/api/photos', '/api/videos',
    '/api/stories', '/api/ads', '/api/tags'
  ];
  for (const ep of publicApis) {
    try {
      const r = await request(BASE + ep);
      if (r.status === 200) {
        let items = '?';
        try { items = JSON.parse(r.body).length || 0; } catch(e) {}
        console.log('  OK  | ' + ep + ' (' + items + ' ta element, ' + r.size + ' bytes)');
        passed++;
      } else {
        console.log('  XATO | ' + ep + ' Status: ' + r.status);
        failed++;
      }
    } catch (e) { console.log('  XATO | ' + ep + ' ' + e.message); failed++; }
  }

  // 4. Admin login
  console.log('\n--- 4. ADMIN KIRISH ---');
  let token = null;
  try {
    const r = await request(BASE + '/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: '1' })
    });
    if (r.status === 200) {
      const body = JSON.parse(r.body);
      token = body.token;
      console.log('  OK  | Admin login muvaffaqiyatli (token: ' + (token ? 'bor' : 'yoq') + ')');
      passed++;
    } else {
      console.log('  XATO | Login rad etildi. Status: ' + r.status);
      failed++;
    }
  } catch (e) { console.log('  XATO | ' + e.message); failed++; }

  // 5. Admin API
  if (token) {
    console.log('\n--- 5. ADMIN API ---');
    const adminApis = [
      '/api/admin/settings', '/api/admin/dashboard/stats',
      '/api/admin/dashboard/logs', '/api/admin/users', '/api/admin/health'
    ];
    for (const ep of adminApis) {
      try {
        const r = await request(BASE + ep, {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        if (r.status === 200) {
          console.log('  OK  | ' + ep + ' (' + r.size + ' bytes)');
          passed++;
        } else {
          console.log('  XATO | ' + ep + ' Status: ' + r.status);
          failed++;
        }
      } catch (e) { console.log('  XATO | ' + ep + ' ' + e.message); failed++; }
    }
  }

  // 6. Storage files
  console.log('\n--- 6. BAZALAR (JSON FAYLLAR) ---');
  const fs = require('fs');
  const path = require('path');
  const storageDir = path.join(__dirname, 'server', 'storage');
  if (fs.existsSync(storageDir)) {
    const files = fs.readdirSync(storageDir).filter(f => f.endsWith('.json'));
    for (const f of files) {
      const fp = path.join(storageDir, f);
      try {
        const content = fs.readFileSync(fp, 'utf8');
        JSON.parse(content);
        const size = fs.statSync(fp).size;
        console.log('  OK  | ' + f + ' (' + size + ' bytes, JSON format togri)');
        passed++;
      } catch (e) {
        console.log('  XATO | ' + f + ' - JSON buzilgan: ' + e.message);
        failed++;
      }
    }
  }

  // Summary
  console.log('\n=============================');
  console.log('NATIJA: ' + passed + ' ta OK, ' + failed + ' ta XATO');
  if (failed === 0) {
    console.log('XULOSA: Sayt BARQAROR ishlayapti!');
  } else {
    console.log('XULOSA: ' + failed + ' ta muammo aniqlandi!');
  }
  console.log('=============================');
}

run().catch(e => console.error('Tekshiruvda xatolik:', e));
