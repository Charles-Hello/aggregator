# Cloudflare Worker 部署指南

## 📋 准备工作

你需要：
1. Cloudflare 账号（免费）：https://dash.cloudflare.com/sign-up
2. 你的 GitHub 仓库信息或 Gist ID

---

## 🚀 部署步骤

### 第一步：修改配置

打开 `cloudflare-worker.js`，修改配置区域（第 13-30 行）：

#### 选项 A：使用 GitHub 仓库（推荐）

```javascript
const CONFIG = {
  SOURCE_TYPE: 'github',
  GITHUB_REPO: 'your-username/agents-d49f76a898',  // 改为你的仓库
  GITHUB_BRANCH: 'main',
  GITHUB_FILE_PATH: 'data/clash.yaml',

  GITHUB_TOKEN: '',  // 公开仓库留空即可
  CACHE_TIME: 300,   // 5分钟缓存
  ACCESS_KEY: '',    // 可选：设置访问密钥保护订阅
};
```

#### 选项 B：使用 GitHub Gist

```javascript
const CONFIG = {
  SOURCE_TYPE: 'gist',
  GIST_ID: 'abc123def456',  // 改为你的 Gist ID
  GIST_FILENAME: 'clash.yaml',

  GITHUB_TOKEN: '',  // 私有 Gist 需要填写
  CACHE_TIME: 300,
  ACCESS_KEY: '',
};
```

### 第二步：创建 Cloudflare Worker

1. 登录 Cloudflare Dashboard：https://dash.cloudflare.com
2. 左侧菜单选择 **Workers & Pages**
3. 点击 **Create Application** → **Create Worker**
4. 给 Worker 起个名字，例如：`clash-subscription`
5. 点击 **Deploy**

### 第三步：上传脚本

1. 点击 **Edit Code** 进入编辑器
2. 删除默认代码
3. 复制 `cloudflare-worker.js` 的全部内容
4. 粘贴到编辑器中
5. 点击右上角 **Save and Deploy**

### 第四步：测试访问

部署成功后，你会得到一个 URL：
```
https://clash-subscription.your-username.workers.dev
```

访问以下地址测试：
- 首页：`https://clash-subscription.your-username.workers.dev/`
- Clash 配置：`https://clash-subscription.your-username.workers.dev/clash`

---

## 🎯 使用订阅链接

### 在 Clash 客户端中使用

1. 复制你的订阅链接：
   ```
   https://clash-subscription.your-username.workers.dev/clash
   ```

2. 打开 Clash 客户端：
   - **Clash for Windows**：配置 → 订阅 → 粘贴链接
   - **ClashX (Mac)**：配置 → 托管配置 → 粘贴链接
   - **Clash for Android**：配置 → 新建配置 → URL → 粘贴链接

3. 点击更新订阅即可

---

## 🔒 可选：添加访问保护

如果你想保护订阅链接，防止被他人使用：

### 1. 设置访问密钥

修改配置中的 `ACCESS_KEY`：
```javascript
ACCESS_KEY: 'my-secret-key-123',  // 设置你的密钥
```

### 2. 使用带密钥的链接

```
https://clash-subscription.your-username.workers.dev/clash?key=my-secret-key-123
```

---

## 🌐 可选：绑定自定义域名

如果你有自己的域名并托管在 Cloudflare：

1. 在 Worker 页面点击 **Settings** → **Triggers**
2. 点击 **Add Custom Domain**
3. 输入你的子域名，例如：`clash.example.com`
4. 点击 **Add Custom Domain**

之后可以使用：
```
https://clash.example.com/clash
```

---

## 📊 查看访问统计

在 Worker 页面可以看到：
- 请求次数
- 错误率
- 响应时间

---

## 🔧 高级配置

### 修改缓存时间

```javascript
CACHE_TIME: 600,  // 改为 10 分钟
```

### 支持多个文件

可以修改脚本，添加多个路径：
```javascript
if (url.pathname === '/clash') {
  return getFile('data/clash.yaml');
} else if (url.pathname === '/v2ray') {
  return getFile('data/v2ray.txt');
}
```

---

## ❓ 常见问题

### Q1: 部署后访问返回 502 错误？
**A:** 检查配置中的 `GITHUB_REPO` 或 `GIST_ID` 是否正确

### Q2: 文件内容没有更新？
**A:** Worker 有缓存，等待 5 分钟或修改 `CACHE_TIME` 为更短时间

### Q3: 私有仓库/Gist 无法访问？
**A:** 需要设置 `GITHUB_TOKEN`：
1. 访问 https://github.com/settings/tokens
2. 生成一个 Personal Access Token (Classic)
3. 权限选择：`repo` (私有仓库) 或 `gist` (私有 Gist)
4. 填入配置中的 `GITHUB_TOKEN`

### Q4: 如何查看原始数据？
**A:** 直接访问 GitHub Raw URL：
- 仓库：`https://raw.githubusercontent.com/用户名/仓库名/main/data/clash.yaml`
- Gist：`https://gist.githubusercontent.com/Gist-ID/raw/clash.yaml`

---

## 📝 总结

你需要做的：
1. ✅ 修改 `cloudflare-worker.js` 中的配置
2. ✅ 在 Cloudflare 创建 Worker
3. ✅ 复制脚本内容并部署
4. ✅ 使用生成的 URL 作为 Clash 订阅链接

有问题随时问我！
