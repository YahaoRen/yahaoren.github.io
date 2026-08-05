const root = document.documentElement;

const searchIndex = [
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
    description: "研究笔记、工程实践与长期思考。",
    keywords: "writing 文章 笔记 blog"
  },
  {
    title: "为什么我要把研究过程写下来",
    type: "Essay",
    url: "/writing/why-i-write.html",
    description: "关于公开写作、可复现研究和个人博客的第一篇文章。",
    keywords: "写作 研究 可复现 blog"
  },
  {
    title: "从 Value-Hijacking 看数据选择器的安全边界",
    type: "Research Note",
    url: "/writing/value-hijacking-notes.html",
    description: "从公开 Artifact 出发，理解 select-then-train 管线中的风险。",
    keywords: "value hijacking 数据选择器 安全 投毒"
  },
  {
    title: "可复现研究 Artifact 的最小清单",
    type: "Field Note",
    url: "/writing/reproducible-artifacts.html",
    description: "把研究结论变成可检查、可运行、可复核的软件交付物。",
    keywords: "reproducible artifact checklist research"
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
    description: "任亚浩的软件工程与 AI 安全研究简介。",
    keywords: "about bio 太原理工大学 software engineering"
  }
];

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
    const haystack = `${item.title} ${item.type} ${item.description} ${item.keywords}`.toLocaleLowerCase();
    return !normalized || normalized.split(/\s+/).every((term) => haystack.includes(term));
  });

  if (!matches.length) {
    results.innerHTML = '<li class="search-empty">没有找到相关内容。试试“安全”“研究”或“项目”。</li>';
    return;
  }

  results.innerHTML = matches.map((item) => `
    <li>
      <a href="${item.url}">
        <span class="search-type">${item.type}</span>
        <span>
          <span class="search-title">${item.title}</span>
          <span class="search-description">${item.description}</span>
        </span>
      </a>
    </li>
  `).join("");
}

function openSearch() {
  if (!dialog || typeof dialog.showModal !== "function") return;
  renderResults("");
  dialog.showModal();
  requestAnimationFrame(() => searchInput?.focus());
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

document.querySelectorAll("[data-copy-code]").forEach((button) => {
  button.addEventListener("click", async () => {
    const block = button.closest(".code-block");
    const code = block?.querySelector("code")?.textContent || "";
    try {
      await navigator.clipboard.writeText(code.trim());
      const original = button.textContent;
      button.textContent = "已复制";
      setTimeout(() => { button.textContent = original; }, 1600);
    } catch {
      button.textContent = "复制失败";
    }
  });
});

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
  const headings = tocLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (!visible) return;
    tocLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`));
  }, { rootMargin: "-20% 0px -68%", threshold: [0, 1] });
  headings.forEach((heading) => observer.observe(heading));
}

document.querySelectorAll("[data-current-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});
