# GitHub Pages 部署指南

## 自動部署（推薦方式）

### 第一次設置

1. **啟用 GitHub Pages**
   - 進入您的 GitHub 倉庫
   - 點擊 **Settings** → **Pages**
   - 在 **Source** 部分，選擇 **GitHub Actions**
   - 保存設置

2. **推送代碼**
   ```bash
   git add .
   git commit -m "準備部署到 GitHub Pages"
   git push origin main  # 或 master
   ```

3. **查看部署狀態**
   - 進入倉庫的 **Actions** 標籤
   - 查看 "Deploy to GitHub Pages" workflow 的執行狀態
   - 等待部署完成（通常需要 2-5 分鐘）

4. **訪問您的網站**
   - 部署完成後，網站將在以下網址可用：
     - `https://<USERNAME>.github.io/<REPO_NAME>/`
   - 例如：`https://wafflefrank.github.io/waffle_backEnd/`

### 後續更新

每次推送代碼到 `main` 或 `master` 分支時，GitHub Actions 會自動：
1. 安裝依賴
2. 構建專案
3. 部署到 GitHub Pages

## 手動部署（備用方式）

如果需要手動部署：

```bash
# 1. 構建專案
npm run build

# 2. 進入 dist 資料夾
cd dist

# 3. 初始化 git（如果還沒有）
git init

# 4. 添加所有文件
git add -A
git commit -m "deploy"

# 5. 推送到 gh-pages 分支
git push -f https://github.com/<USERNAME>/<REPO>.git master:gh-pages

# 6. 返回上一層
cd ..
```

## 配置說明

### 已配置的項目

✅ **路由模式**：使用 Hash 路由（`createWebHashHistory`），適合 GitHub Pages  
✅ **publicPath**：設置為 `'./'`，確保資源路徑正確  
✅ **GitHub Actions**：已配置自動部署 workflow  
✅ **Mock API**：所有 API 調用都使用測試資料

### 注意事項

- 確保您的 GitHub 倉庫是公開的（Public），或者您有 GitHub Pro 帳號
- 如果使用自定義域名，需要在 `dist` 資料夾中創建 `CNAME` 文件
- 部署後可能需要等待幾分鐘才能訪問網站

## 故障排除

### 部署失敗

1. 檢查 **Actions** 標籤中的錯誤訊息
2. 確保 `package.json` 中的依賴都正確
3. 檢查 Node.js 版本是否兼容（建議使用 Node 18）

### 網站無法訪問

1. 確認 GitHub Pages 設置正確（Settings → Pages）
2. 檢查 URL 是否正確（注意大小寫）
3. 等待幾分鐘後再試（DNS 傳播需要時間）

### 資源加載失敗

1. 確認 `vue.config.js` 中的 `publicPath` 設置為 `'./'`
2. 檢查構建後的 `dist` 資料夾中的文件路徑
3. 清除瀏覽器緩存後重試
