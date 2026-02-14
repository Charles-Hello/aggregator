/**
 * Cloudflare Worker - 暴露 clash.yaml 配置文件 (ES Modules 格式)
 *
 * 配置说明：
 * 1. 在 Cloudflare Workers 中创建一个新的 Worker
 * 2. 将此脚本复制到 Worker 编辑器中
 * 3. 配置环境变量（或直接修改下方的配置）
 * 4. 部署
 */

// ==================== 配置区域 ====================
const CONFIG = {
  // 数据源类型: 'gist' 或 'github'
  SOURCE_TYPE: 'gist',

  // GitHub 仓库配置 (SOURCE_TYPE = 'github' 时使用)
  GITHUB_REPO: 'your-username/your-repo-name',
  GITHUB_BRANCH: 'main',
  GITHUB_FILE_PATH: 'data/clash.yaml',

  // GitHub Gist 配置 (SOURCE_TYPE = 'gist' 时使用)
  GIST_ID: 'Charles-Hello/9bf220f441f9b8cbce09438c926b9790',
  GIST_FILENAME: 'clash.yaml',

  // 可选：访问令牌（如果是私有仓库/Gist）
  GITHUB_TOKEN: '', // 留空表示公开访问

  // 缓存时间（秒）
  CACHE_TIME: 300, // 5分钟

  // 可选：访问密钥（用于保护你的订阅）
  ACCESS_KEY: '', // 留空表示无需密钥，设置后需要 ?key=xxx 才能访问
};
// ================================================

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request);
  },
};

async function handleRequest(request) {
  const url = new URL(request.url);

  // 访问密钥验证
  if (CONFIG.ACCESS_KEY) {
    const key = url.searchParams.get('key');
    if (key !== CONFIG.ACCESS_KEY) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  // 路由处理
  if (url.pathname === '/clash' || url.pathname === '/clash.yaml') {
    return getClashConfig();
  } else if (url.pathname === '/') {
    return getHomePage();
  } else {
    return new Response('Not Found', { status: 404 });
  }
}

async function getClashConfig() {
  try {
    let fileUrl;
    const headers = {};

    if (CONFIG.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${CONFIG.GITHUB_TOKEN}`;
    }

    // 根据数据源类型构建 URL
    if (CONFIG.SOURCE_TYPE === 'gist') {
      fileUrl = `https://gist.githubusercontent.com/${CONFIG.GIST_ID}/raw/${CONFIG.GIST_FILENAME}`;
    } else {
      // GitHub 仓库
      fileUrl = `https://raw.githubusercontent.com/${CONFIG.GITHUB_REPO}/${CONFIG.GITHUB_BRANCH}/${CONFIG.GITHUB_FILE_PATH}`;
    }

    // 从远程获取文件
    const response = await fetch(fileUrl, { headers });

    if (!response.ok) {
      return new Response(`Failed to fetch config: ${response.status} ${response.statusText}`, {
        status: 502,
      });
    }

    const content = await response.text();

    // 返回响应，设置缓存
    return new Response(content, {
      headers: {
        'Content-Type': 'text/yaml; charset=utf-8',
        'Cache-Control': `public, max-age=${CONFIG.CACHE_TIME}`,
        'Access-Control-Allow-Origin': '*',
        'Content-Disposition': 'inline; filename="clash.yaml"',
      },
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}

function getHomePage() {
  const host = new URL(CONFIG.SOURCE_TYPE === 'gist'
    ? `https://gist.github.com/${CONFIG.GIST_ID}`
    : `https://github.com/${CONFIG.GITHUB_REPO}`
  ).origin;

  const accessKeyInfo = CONFIG.ACCESS_KEY
    ? `?key=${CONFIG.ACCESS_KEY}`
    : '';

  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Clash 订阅服务</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .card {
      background: white;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 { color: #333; }
    .url-box {
      background: #f8f8f8;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 15px;
      margin: 20px 0;
      word-break: break-all;
      font-family: monospace;
    }
    .info {
      color: #666;
      font-size: 14px;
      margin-top: 20px;
    }
    code {
      background: #f0f0f0;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>🚀 Clash 订阅服务</h1>
    <p>您的 Clash 订阅链接：</p>
    <div class="url-box">
      <a href="/clash${accessKeyInfo}" target="_blank">
        ${new URL('/clash' + accessKeyInfo, 'https://your-worker.workers.dev').href}
      </a>
    </div>

    <div class="info">
      <h3>使用说明：</h3>
      <ul>
        <li>将上方链接复制到 Clash 客户端的订阅地址中</li>
        <li>数据源：<code>${CONFIG.SOURCE_TYPE === 'gist' ? 'GitHub Gist' : 'GitHub Repository'}</code></li>
        <li>缓存时间：<code>${CONFIG.CACHE_TIME}秒</code></li>
        <li>更新时间：每次访问时自动从源获取最新数据</li>
      </ul>
    </div>
  </div>
</body>
</html>
  `;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
