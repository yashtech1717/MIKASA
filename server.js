/**
 * Production Static & Streaming Server for Render / Cloud Deployment
 * Supports full range requests for video streaming (MP4/WebM) with zero lag.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5500;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime'
};

const server = http.createServer((req, res) => {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let cleanUrl = req.url.split('?')[0];

  // API Route: Public cloud config for Supabase (injected from Render Environment Variables with defaults)
  if (cleanUrl === '/api/config') {
    const rawUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://vkzzdnepmwhsnzmeozxr.supabase.co').trim();
    const supabaseUrl = rawUrl.replace(/^['"]|['"]$/g, '').replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
    const supabaseAnonKey = (process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_27dH6hm79SXgqxz8wF25nQ_1IbAhX6s').trim().replace(/^['"]|['"]$/g, '');

    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(JSON.stringify({
      supabaseUrl,
      supabaseAnonKey,
      hasEnvConfig: Boolean(supabaseUrl && supabaseAnonKey)
    }));
    return;
  }

  if (cleanUrl === '/' || cleanUrl === '') {
    cleanUrl = '/index.html';
  }

  // Prevent directory traversal
  const safePath = path.normalize(cleanUrl).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(BASE_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const totalSize = stats.size;
    const isVideo = ext === '.mp4' || ext === '.webm' || ext === '.mov';

    // Parse HTTP Byte-Range requests
    const rangeHeader = req.headers.range;

    if (rangeHeader && isVideo) {
      const range = parseRange(rangeHeader, totalSize);

      if (!range || range.invalid) {
        res.writeHead(416, {
          'Content-Range': `bytes */${totalSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Type': contentType
        });
        res.end();
        return;
      }

      res.writeHead(206, {
        'Content-Range': `bytes ${range.start}-${range.end}/${totalSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': range.chunkSize,
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      });

      if (req.method === 'HEAD') {
        res.end();
        return;
      }

      const fileStream = fs.createReadStream(filePath, { start: range.start, end: range.end });
      fileStream.on('error', () => {
        if (!res.headersSent) res.writeHead(500);
        res.end();
      });
      fileStream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': totalSize,
        'Content-Type': contentType,
        'Accept-Ranges': isVideo ? 'bytes' : 'none',
        'Cache-Control': ext === '.html' ? 'no-cache, must-revalidate' : 'public, max-age=3600'
      });

      if (req.method === 'HEAD') {
        res.end();
        return;
      }

      const fileStream = fs.createReadStream(filePath);
      fileStream.on('error', () => {
        if (!res.headersSent) res.writeHead(500);
        res.end();
      });
      fileStream.pipe(res);
    }
  });
});

/**
 * Robust RFC 7233 range header parser supporting:
 * - bytes=start-end
 * - bytes=start-
 * - bytes=-suffixLength
 * Clamps end to totalSize - 1, validates start < totalSize.
 */
function parseRange(header, totalSize) {
  if (!header || !header.startsWith('bytes=')) return null;
  const spec = header.slice(6).trim();
  const part = spec.split(',')[0].trim();
  const dashIndex = part.indexOf('-');
  if (dashIndex === -1) return { invalid: true };

  const startStr = part.slice(0, dashIndex).trim();
  const endStr = part.slice(dashIndex + 1).trim();

  let start;
  let end;

  if (startStr === '') {
    // Suffix byte range: bytes=-500000
    const suffix = parseInt(endStr, 10);
    if (isNaN(suffix) || suffix <= 0) return { invalid: true };
    start = Math.max(0, totalSize - suffix);
    end = totalSize - 1;
  } else {
    start = parseInt(startStr, 10);
    if (isNaN(start) || start < 0) return { invalid: true };

    if (endStr === '') {
      end = totalSize - 1;
    } else {
      end = parseInt(endStr, 10);
      if (isNaN(end) || end < start) return { invalid: true };
    }
  }

  if (start >= totalSize) {
    return { invalid: true };
  }

  end = Math.min(end, totalSize - 1);
  return { start, end, chunkSize: end - start + 1 };
}

server.listen(PORT, () => {
  console.log(`🎬 Cinematic Server running on port ${PORT}`);
  console.log(`📡 Ready for online deployment on Render / Cloud`);
});
