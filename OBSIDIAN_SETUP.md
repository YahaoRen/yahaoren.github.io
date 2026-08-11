# Obsidian 自动发布设置

本仓库可以直接作为一个 Obsidian Vault。公开笔记保存在 `_notes/`，GitHub Pages 会把 `published: true` 的 Markdown 自动生成到 `/writing/<文件名>.html`。

## 1. 打开 Vault

在 Obsidian 中选择“打开本地仓库”，打开本仓库根目录：

```text
D:\Value-Hijacking Poisoning\AAAI\YahaoRen.github.io
```

建议在 Obsidian 的“文件与链接”设置中配置：

- 新建笔记的默认位置：`_notes`
- 新附件的默认位置：`assets/notes`
- 关闭“使用 [[Wikilinks]]”，使用标准 Markdown 链接

这些目录与链接选项已写入本机 Vault 的 `.obsidian` 配置；第一次打开后检查一次即可。

## 2. 配置模板

启用 Obsidian 自带的“模板”核心插件，并将模板文件夹设为 `_templates`。新建笔记后插入 `blog-note` 模板。

模板默认包含：

```yaml
published: false
```

完成并确认可以公开后，改成：

```yaml
published: true
```

文件名会成为永久链接的一部分。建议使用稳定的 ASCII kebab-case，例如 `data-selection-notes.md`；正文标题可以使用中文。不要把笔记命名为 `index.md`，该名称保留给写作归档页。

`date` 应填写实际发布时间。未来日期的笔记在到达该时间前不会出现在文章页、归档、搜索、RSS 或 sitemap 中。

## 3. 安装 Obsidian Git

进入“设置 → 第三方插件 → 浏览”，搜索 `Git`，安装并启用 Obsidian Git。

插件文档：[安装](https://publish.obsidian.md/git-doc/Installation) · [自动备份与同步](https://publish.obsidian.md/git-doc/Features)

推荐配置：

- **Auto commit-and-sync interval (minutes)**：`3`
- **Auto commit-and-sync after stopping file edits**：开启
- **Auto pull on startup**：开启
- **Push on commit-and-sync**：开启
- **Pull on commit-and-sync**：开启

设置完成后，在命令面板中手动运行一次 `Git: Commit-and-sync`，确认 commit、pull、push 全部成功。之后每次停止编辑约 3 分钟，插件会自动同步；GitHub Pages 仍需要一段构建时间，因此不是逐字实时更新。

桌面端会使用本机 Git。本机已配置的 GitHub SSH 远程为：

```text
git@github.com:YahaoRen/yahaoren.github.io.git
```

不需要 GitHub OAuth，也不需要在插件中填写账号或令牌。本机仓库已加入 Git 的 `safe.directory`，Obsidian 可以直接调用 Git。

## 4. 发布流程

1. 在 `_notes/` 新建 Markdown。
2. 插入 `blog-note` 模板并填写标题、摘要和标签。
3. 写作期间保持 `published: false`。
4. 准备公开时改为 `published: true`。
5. Obsidian Git 自动执行 commit、pull 和 push。
6. GitHub Pages 构建后，文章出现在写作归档、主页最新笔记、站内搜索、RSS 和 sitemap 中。

每篇公开文章的标题下方提供两个操作：

- **下载 Markdown**：下载仓库中的原始 `.md` 文件，包含 YAML front matter。
- **导出 PDF**：打开浏览器打印窗口；选择“另存为 PDF”即可导出排版后的文章。

## 公开仓库安全边界

`published: false` 只阻止网页生成，不会隐藏 GitHub 仓库中的 Markdown 源文件或 Git 历史。`assets/notes/` 中的图片也会进入公开仓库，即使引用它的笔记尚未发布。此 Vault 只能保存允许立即出现在 GitHub 源码中的内容；真正私密的笔记应放在另一个私有 Vault。不要放入密码、个人隐私、匿名评审材料或未公开实验结果。

Obsidian Git 会提交仓库中所有未被 `.gitignore` 忽略的变化，不只提交当前正在编辑的笔记。`.obsidian/` 已被忽略，所以界面布局和本机插件状态不会上传；换电脑后需要重新安装并配置插件。

Obsidian 专有语法（例如 `[[WikiLink]]`、`![[embed]]`、Dataview 查询）不会被 GitHub Pages 原生转换。博客正文应使用标准 Markdown；图片建议使用：

```markdown
![图片说明](../assets/notes/example.png)
```

Jekyll 会把正文里的 `{{ ... }}` 和 `{% ... %}` 当作 Liquid。技术笔记需要原样展示这类内容时，用下面的标记包住代码：

```liquid
{% raw %}
{{ value }}
{% endraw %}
```
