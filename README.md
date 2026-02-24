# waffle_backend

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

## GitHub Pages 部署

### 自動部署（推薦）

此專案已配置 GitHub Actions，當您推送代碼到 `main` 或 `master` 分支時，會自動構建並部署到 GitHub Pages。

**設置步驟：**

1. 在 GitHub 倉庫中，進入 **Settings** → **Pages**
2. 在 **Source** 部分，選擇 **GitHub Actions**
3. 推送代碼到 `main` 或 `master` 分支
4. GitHub Actions 會自動構建並部署

部署完成後，您的網站將在以下網址可用：
- `https://<USERNAME>.github.io/<REPO_NAME>/`

### 手動部署

如果需要手動部署，可以使用以下命令：

```bash
npm run build
```

然後將 `dist` 資料夾的內容推送到 `gh-pages` 分支。

### 注意事項

- 此專案使用 Hash 路由模式（`createWebHashHistory`），適合 GitHub Pages
- `publicPath` 已設置為 `'./'`，確保資源路徑正確
- 目前使用 Mock API，所有 API 調用都返回測試資料

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
