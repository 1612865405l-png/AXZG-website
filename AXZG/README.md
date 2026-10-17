# 安行智构宣传网站

这是一套可直接发布到 GitHub Pages 的静态网站，无需安装程序、无需数据库。

## 文件说明

- `index.html`：网页内容
- `styles.css`：页面样式和手机适配
- `script.js`：导航、弹窗、数字动画等交互
- `assets/`：网站图片、Logo 和图标
- `.nojekyll`：让 GitHub Pages 按原样发布静态文件

## 发布到 GitHub Pages

1. 进入 GitHub 仓库，选择 **Add file → Upload files**。
2. 上传本文件夹里的全部内容。请注意：`index.html` 必须位于仓库最外层，不要只上传外层文件夹。
3. 选择 **Commit directly to the main branch**，提交更改。
4. 打开 **Settings → Pages**。
5. 在 **Build and deployment** 中选择 **Deploy from a branch**。
6. Branch 选择 `main`，文件夹选择 `/(root)`，保存。
7. 等待几分钟，GitHub 会显示网站地址。

## 上线前必须替换

在 `index.html` 中搜索并修改：

- `XX 大学`
- `anxing@xxx.edu.cn`
- `中国 · 西部`
- 专利成果数量 `11`
- 页脚年份、团队名称和正式项目介绍

## 修改方法

- 修改文字：编辑 `index.html`
- 修改颜色和尺寸：编辑 `styles.css` 顶部的颜色变量
- 替换图片：用新图片覆盖 `assets` 中的同名文件，或在 `index.html` / `styles.css` 中修改图片路径
- 修改卡片弹窗：编辑 `script.js` 中的 `details` 内容

建议保留英文文件名，不要使用空格。更新文件并提交到 `main` 后，GitHub Pages 会自动重新发布。

## 本地预览

直接双击 `index.html` 即可预览。正式发布后，页面导航、卡片弹窗、手机菜单和动画均可正常使用。
