# 你的 Cloudflare Worker 配置信息

## ✅ 配置已完成

我已经为你配置好了 `cloudflare-worker.js`：

- **数据源类型**：GitHub Gist
- **Gist ID**：9bf220f441f9b8cbce09438c926b9790
- **文件名**：clash.yaml
- **数据源 URL**：https://gist.githubusercontent.com/Charles-Hello/9bf220f441f9b8cbce09438c926b9790/raw/clash.yaml

---

## 🚀 接下来的部署步骤

### 第一步：登录 Cloudflare

访问：https://dash.cloudflare.com

- 如果没有账号，点击 **Sign Up** 注册（完全免费）
- 如果已有账号，直接登录

### 第二步：创建 Worker

1. 登录后，在左侧菜单找到 **Workers & Pages**
2. 点击 **Create Application**
3. 选择 **Create Worker**
4. 给 Worker 起个名字，例如：`clash-sub`（可以随意命名）
5. 点击 **Deploy** 按钮

### 第三步：上传脚本

1. 部署后会看到一个编辑器界面
2. 点击右上角的 **Edit Code** 或 **Quick Edit**
3. **删除编辑器中的所有默认代码**
4. 打开本地的 `cloudflare-worker.js` 文件
5. **复制全部内容**
6. **粘贴到 Cloudflare 编辑器中**
7. 点击右上角的 **Save and Deploy** 按钮

### 第四步：获取订阅链接

部署成功后，你会看到类似这样的链接：

```
https://clash-sub.你的用户名.workers.dev
```

你的 **Clash 订阅链接** 就是：

```
https://clash-sub.你的用户名.workers.dev/clash
```

---

## 📱 在 Clash 客户端中使用

### Clash for Windows
1. 打开软件
2. 点击 **Profiles**
3. 在 URL 框中粘贴你的订阅链接
4. 点击 **Download**

### ClashX (Mac)
1. 菜单栏图标 → **配置**
2. **托管配置** → **管理**
3. 点击 **+** 添加
4. 粘贴订阅链接

### Clash for Android
1. 打开 App
2. **配置** → 点击 **+**
3. 选择 **URL**
4. 粘贴订阅链接
5. 保存

---

## 🔧 可选配置

### 添加访问保护（防止他人使用）

如果你想保护订阅链接，打开 `cloudflare-worker.js`，修改这一行：

```javascript
ACCESS_KEY: 'my-secret-password-123',  // 设置你的密钥
```

重新部署后，订阅链接需要加上密钥：

```
https://clash-sub.你的用户名.workers.dev/clash?key=my-secret-password-123
```

### 自定义域名

如果你有域名托管在 Cloudflare：

1. Worker 页面 → **Settings** → **Triggers**
2. 点击 **Add Custom Domain**
3. 输入子域名，如：`clash.yourdomain.com`
4. 保存

---

## 📊 查看状态

部署后访问：

- **首页**（测试页面）：`https://你的worker.workers.dev/`
- **Clash 配置**：`https://你的worker.workers.dev/clash`

在浏览器中访问 `/clash`，应该能看到 YAML 格式的配置内容。

---

## ❓ 可能的问题

### Q: 部署后访问返回 502 错误？
检查 Gist 是否公开，或者 Gist ID 是否正确。

### Q: 想修改缓存时间？
打开 `cloudflare-worker.js`，找到：
```javascript
CACHE_TIME: 300,  // 改成你想要的秒数，如 600 = 10分钟
```

### Q: 如何更新配置？
你的 GitHub Actions 每次更新 Gist 后，Worker 会在缓存时间过后自动获取最新数据。

---

## 📝 总结

1. ✅ 配置文件已准备好（`cloudflare-worker.js`）
2. ⏭️ 登录 Cloudflare Dashboard
3. ⏭️ 创建 Worker 并粘贴脚本
4. ⏭️ 获取订阅链接
5. ⏭️ 添加到 Clash 客户端

**需要帮助？** 随时问我！
