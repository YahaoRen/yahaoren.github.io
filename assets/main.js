const root = document.documentElement;

const fallbackSearchIndex = [
  {
    title: "首页 / Home",
    type: "Page",
    url: "/",
    description: "任亚浩的研究、写作与项目入口。",
    keywords: "home 首页 任亚浩 yahao ren"
  },
  {
    title: "研究 / Research",
    type: "Page",
    url: "/research/",
    description: "AI 安全、数据选择与可信微调研究。",
    keywords: "research 研究 AI security data selection LLM"
  },
  {
    title: "Value-Hijacking",
    type: "Research",
    url: "/research/value-hijacking.html",
    description: "数据选择器如何放大大模型微调供应链中的投毒风险。",
    keywords: "value hijacking poisoning selector finetuning artifact pVLDB"
  },
  {
    title: "写作 / Writing",
    type: "Page",
    url: "/writing/",
    description: "公开文章与研究笔记归档。",
    keywords: "writing 文章 笔记 blog"
  },
  {
    title: "项目 / Projects",
    type: "Page",
    url: "/projects.html",
    description: "公开研究 Artifact、AI 文献工具与软件工程实践。",
    keywords: "projects github python vue java"
  },
  {
    title: "关于 / About",
    type: "Page",
    url: "/about.html",
    description: "任亚浩的 AI 安全与软件工程研究简介。",
    keywords: "about bio AI security software engineering"
  }
];

let searchIndex = fallbackSearchIndex;
let searchIndexRequest;

function loadSearchIndex() {
  if (!searchIndexRequest) {
    searchIndexRequest = fetch("/assets/search-index.json", {
      headers: { Accept: "application/json" }
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Search index request failed: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length) searchIndex = data;
        return searchIndex;
      })
      .catch(() => searchIndex);
  }
  return searchIndexRequest;
}

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("theme", theme);
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    const next = theme === "dark" ? "浅色" : "深色";
    button.setAttribute("aria-label", `切换到${next}模式`);
    button.setAttribute("title", `切换到${next}模式`);
    button.dataset.mode = theme;
  });
}

const savedTheme = localStorage.getItem("theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
setTheme(savedTheme || preferredTheme);

document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });
});

const mobileToggle = document.querySelector("[data-mobile-toggle]");
const navLinks = document.querySelector("[data-nav-links]");

if (mobileToggle && navLinks) {
  mobileToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    mobileToggle.setAttribute("aria-expanded", String(isOpen));
    mobileToggle.setAttribute("aria-label", isOpen ? "关闭导航" : "打开导航");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      mobileToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const dialog = document.querySelector("[data-search-dialog]");
const searchInput = document.querySelector("[data-search-input]");
const results = document.querySelector("[data-search-results]");

function renderResults(query = "") {
  if (!results) return;
  const normalized = query.trim().toLocaleLowerCase();
  const matches = searchIndex.filter((item) => {
    const haystack = [item.title, item.type, item.description, item.keywords].filter(Boolean).join(" ").toLocaleLowerCase();
    return !normalized || normalized.split(/\s+/).every((term) => haystack.includes(term));
  });

  results.replaceChildren();
  if (!matches.length) {
    const empty = document.createElement("li");
    empty.className = "search-empty";
    empty.textContent = "没有找到相关内容。试试“安全”“研究”或“项目”。";
    results.append(empty);
    return;
  }

  matches.forEach((item) => {
    const row = document.createElement("li");
    const link = document.createElement("a");
    const type = document.createElement("span");
    const copy = document.createElement("span");
    const title = document.createElement("span");
    const description = document.createElement("span");

    link.href = item.url;
    type.className = "search-type";
    type.textContent = item.type || "Page";
    title.className = "search-title";
    title.textContent = item.title || "Untitled";
    description.className = "search-description";
    description.textContent = item.description || "";

    copy.append(title, description);
    link.append(type, copy);
    row.append(link);
    results.append(row);
  });
}

function openSearch() {
  if (!dialog || typeof dialog.showModal !== "function") return;
  renderResults("");
  dialog.showModal();
  requestAnimationFrame(() => searchInput?.focus());
  loadSearchIndex().then(() => {
    if (dialog.open) renderResults(searchInput?.value || "");
  });
}

document.querySelectorAll("[data-search-open]").forEach((button) => {
  button.addEventListener("click", openSearch);
});

document.querySelector("[data-search-close]")?.addEventListener("click", () => dialog?.close());
searchInput?.addEventListener("input", (event) => renderResults(event.target.value));

dialog?.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
  if (!inside) dialog.close();
});

document.addEventListener("keydown", (event) => {
  const target = event.target;
  const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable;
  if (event.key === "Escape" && dialog?.open) {
    event.preventDefault();
    dialog.close();
    return;
  }
  if (event.key === "/" && !isTyping && !event.metaKey && !event.ctrlKey && !event.altKey) {
    event.preventDefault();
    openSearch();
  }
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const group = button.closest("[data-filter-group]");
    const selected = button.dataset.filter;
    group?.querySelectorAll("[data-filter]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    document.querySelectorAll("[data-entry-type]").forEach((entry) => {
      entry.hidden = selected !== "all" && entry.dataset.entryType !== selected;
    });
  });
});

function enhanceMarkdownCodeBlocks() {
  const addHeader = (block) => {
    if (block.querySelector(":scope > .code-header")) return;
    block.classList.add("code-block");

    const languageClass = [...block.classList].find((name) => name.startsWith("language-"));
    const language = languageClass ? languageClass.slice("language-".length).replaceAll("-", " ") : "code";
    const header = document.createElement("div");
    const label = document.createElement("span");
    const button = document.createElement("button");

    header.className = "code-header";
    label.textContent = language;
    button.className = "copy-code";
    button.type = "button";
    button.dataset.copyCode = "";
    button.textContent = "复制";
    header.append(label, button);
    block.prepend(header);
  };

  document.querySelectorAll(".article-body div.highlighter-rouge").forEach(addHeader);
  document.querySelectorAll(".article-body > pre").forEach((pre) => {
    const wrapper = document.createElement("div");
    const languageClass = [...pre.classList].find((name) => name.startsWith("language-"));
    wrapper.className = languageClass ? `code-block ${languageClass}` : "code-block";
    pre.before(wrapper);
    wrapper.append(pre);
    addHeader(wrapper);
  });
}

enhanceMarkdownCodeBlocks();

document.querySelectorAll("[data-copy-code]").forEach((button) => {
  button.addEventListener("click", async () => {
    const block = button.closest(".code-block");
    const code = block?.querySelector("code")?.textContent || "";
    try {
      await navigator.clipboard.writeText(code.trimEnd());
      const original = button.textContent;
      button.textContent = "已复制";
      setTimeout(() => { button.textContent = original; }, 1600);
    } catch {
      button.textContent = "复制失败";
    }
  });
});

const articleActionStatus = document.querySelector("[data-article-action-status]");
let articleActionStatusTimer;

function setArticleActionStatus(message, clearAfter = 0) {
  if (!articleActionStatus) return;
  clearTimeout(articleActionStatusTimer);
  articleActionStatus.textContent = message;
  if (clearAfter > 0) {
    articleActionStatusTimer = setTimeout(() => {
      articleActionStatus.textContent = "";
    }, clearAfter);
  }
}

document.querySelectorAll("[data-download-markdown]").forEach((link) => {
  link.addEventListener("click", async (event) => {
    event.preventDefault();
    if (link.getAttribute("aria-busy") === "true") return;

    const sourceUrl = link.href;
    const filename = link.dataset.downloadFilename || "note.md";
    link.setAttribute("aria-busy", "true");
    setArticleActionStatus("正在准备 Markdown…");

    try {
      const response = await fetch(sourceUrl, {
        cache: "no-store",
        headers: { Accept: "text/markdown, text/plain;q=0.9, */*;q=0.8" }
      });
      if (!response.ok) throw new Error(`Markdown download failed: ${response.status}`);

      const markdown = await response.blob();
      const blobUrl = URL.createObjectURL(new Blob([markdown], { type: "text/markdown;charset=utf-8" }));
      const download = document.createElement("a");
      download.href = blobUrl;
      download.download = filename;
      download.hidden = true;
      document.body.append(download);
      download.click();
      download.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      setArticleActionStatus("Markdown 已开始下载。", 3200);
    } catch {
      setArticleActionStatus("无法直接下载，正在打开 Markdown 源文件…");
      window.location.assign(sourceUrl);
    } finally {
      link.removeAttribute("aria-busy");
    }
  });
});

document.querySelectorAll("[data-export-pdf]").forEach((button) => {
  button.addEventListener("click", () => {
    setArticleActionStatus("请在打印窗口中选择“另存为 PDF”，纸张设为 A4。");
    requestAnimationFrame(() => window.print());
  });
});

window.addEventListener("afterprint", () => setArticleActionStatus("", 0));

function generateTableOfContents() {
  const lists = [...document.querySelectorAll("[data-generated-toc]")];
  if (!lists.length) return;

  const source = document.querySelector(lists[0].dataset.tocSource || "#note-body");
  const headings = source ? [...source.querySelectorAll("h2, h3")] : [];
  const usedIds = new Set();

  headings.forEach((heading, index) => {
    const normalized = heading.textContent
      .trim()
      .normalize("NFKC")
      .toLocaleLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\u3400-\u9fff-]/g, "")
      .replace(/^-+|-+$/g, "");
    const base = heading.id || normalized || `section-${index + 1}`;
    let candidate = base;
    let suffix = 2;
    let existing = document.getElementById(candidate);

    while (usedIds.has(candidate) || (existing && existing !== heading)) {
      candidate = `${base}-${suffix}`;
      suffix += 1;
      existing = document.getElementById(candidate);
    }

    heading.id = candidate;
    usedIds.add(candidate);
  });

  document.querySelectorAll("[data-generated-toc-shell]").forEach((shell) => {
    shell.hidden = headings.length === 0;
  });

  lists.forEach((list) => {
    list.replaceChildren();
    headings.forEach((heading) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      item.className = `toc-level-${heading.tagName.toLocaleLowerCase()}`;
      link.href = `#${heading.id}`;
      link.dataset.tocTarget = heading.id;
      link.textContent = heading.textContent.trim();
      item.append(link);
      list.append(item);
    });
  });
}

generateTableOfContents();

const progress = document.querySelector("[data-progress]");
if (progress) {
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0;
    progress.style.width = `${percent}%`;
  };
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
}

const tocLinks = [...document.querySelectorAll(".article-toc a")];
if (tocLinks.length && "IntersectionObserver" in window) {
  const tocTargets = tocLinks.map((link) => {
    const href = link.getAttribute("href") || "";
    let id = link.dataset.tocTarget || href.replace(/^#/, "");
    try { id = decodeURIComponent(id); } catch { /* Keep the original fragment. */ }
    return { link, heading: document.getElementById(id) };
  }).filter((item) => item.heading);
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (!visible) return;
    tocTargets.forEach(({ link, heading }) => link.classList.toggle("is-active", heading === visible.target));
  }, { rootMargin: "-20% 0px -68%", threshold: [0, 1] });
  tocTargets.forEach(({ heading }) => observer.observe(heading));
}

document.querySelectorAll("[data-current-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});
