/**
 * Optional Vercel Serverless Function: /api/save
 * Menyimpan perubahan berita & komentar secara otomatis ke GitHub Repository
 * menggunakan Environment Variables di Vercel:
 * - GITHUB_TOKEN (Personal Access Token dengan akses repo/contents write)
 * - GITHUB_REPO  (contoh: "username/foxsa-news")
 * - GITHUB_BRANCH (opsional, default: "main")
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token || !repo) {
    return res.status(400).json({
      error: 'GITHUB_TOKEN atau GITHUB_REPO belum diset di Environment Variables Vercel.'
    });
  }

  try {
    const { data } = req.body || {};
    if (!data || !Array.isArray(data.posts)) {
      return res.status(400).json({ error: 'Payload data tidak valid.' });
    }

    const jsonString = JSON.stringify(data, null, 2);
    const jsString = '// Data bawaan FoxSA News (Otomatis di-load oleh website)\nwindow.FOXSA_INITIAL_DATA = ' + jsonString + ';\n';

    await commitToGitHub(repo, branch, token, 'data/posts.json', jsonString, 'Update data/posts.json via FoxSA Web');
    await commitToGitHub(repo, branch, token, 'js/data.js', jsString, 'Update js/data.js via FoxSA Web');

    return res.status(200).json({ ok: true, message: 'Berhasil disimpan ke GitHub Repository.' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}

async function commitToGitHub(repo, branch, token, filePath, contentText, message) {
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'FoxSA-News-Vercel'
  };

  let sha = undefined;
  const getRes = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, { headers });
  if (getRes.ok) {
    const meta = await getRes.json();
    sha = meta.sha;
  }

  const encoded = Buffer.from(contentText, 'utf8').toString('base64');
  const putRes = await fetch(apiUrl, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      content: encoded,
      branch,
      ...(sha ? { sha } : {})
    })
  });

  if (!putRes.ok) {
    const errText = await putRes.text();
    throw new Error(`GitHub API Error (${putRes.status}): ${errText}`);
  }
}

