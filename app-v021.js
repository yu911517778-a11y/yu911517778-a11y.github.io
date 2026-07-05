const state = {
  mode: "agent",
  points: 12800,
  refs: [],
  lastResult: "",
  serviceStatus: "fallback",
  history: [],
  busyTimer: null,
  busyIndex: 0,
  lastRun: null
};

const primaryWorkerEntry = "https://short-video-agent-demo.wide-mockingbird.workers.dev/";
const rootPagesEntry = "https://yu911517778-a11y.github.io/";
const projectPagesEntry = "https://yu911517778-a11y.github.io/ai-short-drama-agent-demo/";
const githubPagesEntry = rootPagesEntry;
const stableBuildId = "d15618eb38dc729f61b595bed7c8e22427ec079b";
const rawGithackEntry = `https://raw.githack.com/yu911517778-a11y/ai-short-drama-agent-demo/${stableBuildId}/index.html`;
const staticallyEntry = `https://cdn.statically.io/gh/yu911517778-a11y/ai-short-drama-agent-demo/${stableBuildId}/index.html`;
const jsDelivrEntry = `https://cdn.jsdelivr.net/gh/yu911517778-a11y/ai-short-drama-agent-demo@${stableBuildId}/index.html`;
const htmlPreviewEntry = "https://htmlpreview.github.io/?https://github.com/yu911517778-a11y/ai-short-drama-agent-demo/blob/gh-pages/index.html";
const remoteApiBase = primaryWorkerEntry.replace(/\/$/, "");
const historyKey = "shortDramaAgentHistory:v1";
const settingsKey = "shortDramaAgentSettings:v1";
const expectedCacheName = "short-drama-studio-v21";
const liveApiEnabled = false;
const customerEntries = [
  ["客户主入口", githubPagesEntry],
  ["备用入口 1（长链主站）", projectPagesEntry],
  ["备用入口 2（临时 Worker）", primaryWorkerEntry],
  ["备用入口 3（RawGithack）", rawGithackEntry],
  ["备用入口 4（HTMLPreview）", htmlPreviewEntry]
];

const modeButtons = [...document.querySelectorAll("[data-mode]")];
const ratioSelect = document.querySelector("#ratioSelect");
const resolutionSelect = document.querySelector("#resolutionSelect");
const durationSelect = document.querySelector("#durationSelect");
const modelField = document.querySelector("#modelField");
const durationField = document.querySelector("#durationField");
const fileInput = document.querySelector("#fileInput");
const uploadButton = document.querySelector("#uploadButton");
const dropZone = document.querySelector("#dropZone");
const thumbRow = document.querySelector("#thumbRow");
const promptInput = document.querySelector("#promptInput");
const referenceButton = document.querySelector("#referenceButton");
const regenerateButton = document.querySelector("#regenerateButton");
const demoRunButton = document.querySelector("#demoRunButton");
const referenceMenu = document.querySelector("#referenceMenu");
const createButton = document.querySelector("#createButton");
const resultBody = document.querySelector("#resultBody");
const runState = document.querySelector("#runState");
const pointsValue = document.querySelector("#pointsValue");
const summaryButton = document.querySelector("#summaryButton");
const copyButton = document.querySelector("#copyButton");
const downloadButton = document.querySelector("#downloadButton");
const noticeButton = document.querySelector("#noticeButton");
const noticePopover = document.querySelector("#noticePopover");
const caseGrid = document.querySelector("#caseGrid");
const serviceDot = document.querySelector("#serviceDot");
const serviceText = document.querySelector("#serviceText");
const footerStatus = document.querySelector("#footerStatus");
const shareButton = document.querySelector("#shareButton");
const toast = document.querySelector("#toast");
const historyList = document.querySelector("#historyList");
const clearHistoryButton = document.querySelector("#clearHistoryButton");
const runMeta = document.querySelector("#runMeta");
const currentEntryText = document.querySelector("#currentEntryText");
const currentEntryMeta = document.querySelector("#currentEntryMeta");
const apiRouteText = document.querySelector("#apiRouteText");
const apiRouteMeta = document.querySelector("#apiRouteMeta");
const cacheText = document.querySelector("#cacheText");
const cacheMeta = document.querySelector("#cacheMeta");
const copyCurrentButton = document.querySelector("#copyCurrentButton");
const copyBackupButton = document.querySelector("#copyBackupButton");
const copyDiagnosticButton = document.querySelector("#copyDiagnosticButton");
const diagnosticButton = document.querySelector("#diagnosticButton");
const copyHandoffButton = document.querySelector("#copyHandoffButton");
const copyPitchButton = document.querySelector("#copyPitchButton");
const openMirrorButton = document.querySelector("#openMirrorButton");
const handoffDemoButton = document.querySelector("#handoffDemoButton");
const copyDemoScriptButton = document.querySelector("#copyDemoScriptButton");
const copyBriefButton = document.querySelector("#copyBriefButton");
const copyLaunchButton = document.querySelector("#copyLaunchButton");
const copyFollowupButton = document.querySelector("#copyFollowupButton");
const copyPilotButton = document.querySelector("#copyPilotButton");
const copyMobileEntryButton = document.querySelector("#copyMobileEntryButton");
const openRootEntryButton = document.querySelector("#openRootEntryButton");
const copyExperienceGuideButton = document.querySelector("#copyExperienceGuideButton");
const copyMaterialPackButton = document.querySelector("#copyMaterialPackButton");
const copyClientChecklistButton = document.querySelector("#copyClientChecklistButton");

const previewResult = [
  "【输入类型判断】",
  "类型：AI短剧主控任务",
  "用户输入：古风复仇女主在冷宫发现身份玉佩。",
  "",
  "【自动选择的输出模式】",
  "标准生产模式：先做一条 10 秒竖屏钩子，再沉淀角色与场景资产。",
  "",
  "【当前处理范围】",
  "本轮只处理 1 个最小可生产单元：开局钩子、角色锁定、场景母图、视频提示词。",
  "",
  "【调用节点】",
  "N01 剧本改编 -> N02 角色资产 -> N03 场景资产 -> N06 视频提示词 -> N10 返工诊断。",
  "",
  "【可直接执行的生成方案】",
  "镜头 1：玉佩特写，弱光下出现旧纹路，保留环境声。",
  "镜头 2：推到女主面部，她压住情绪，眼神从恐惧转为判断。",
  "镜头 3：她收起玉佩，听见脚步声，反手藏入袖中，结尾留反击悬念。",
  "",
  "【质检与返工方向】",
  "角色变脸回 N02；场景跳变回 N03；动作失败拆成更短镜头；出现字幕、水印或多余文字则重跑负面限制。",
  "",
  "【本轮交付结果】",
  "这是打开页面后的样例输出。点击 Generate 后会替换为当前输入的真实主控结果。"
].join("\n");

const busySteps = [
  "输入类型判断",
  "选择生产模式",
  "调度独立节点",
  "生成执行方案",
  "质检返工路径"
];

const cases = [
  { title: "冷宫反击", image: "assets/palace-night.webp", meta: "9:16 古风钩子", prompt: "古风复仇女主在冷宫发现身份玉佩，镜头从玉佩特写推到她压住情绪的脸，结尾给一个反击悬念。" },
  { title: "身份揭示", image: "assets/hanfu-lantern.webp", meta: "角色锁定", prompt: "女主在灯火下发现自己真实身份，手中信物发光，镜头先拍道具再切到她震惊又克制的表情。" },
  { title: "都市追逃", image: "assets/city-motion.webp", meta: "运动镜头", prompt: "都市夜晚追逃，女主穿过霓虹街道回头确认追兵，镜头手持跟拍，结尾她钻进巷口反将一军。" },
  { title: "影视棚预演", image: "assets/film-studio.webp", meta: "布光参考", prompt: "短剧拍摄现场预演，一条强冲突对白戏，要求给出角色站位、灯光方向、镜头调度和返工判断。" },
  { title: "夜戏调度", image: "assets/film-set.webp", meta: "现场调度", prompt: "雨夜对峙戏，男女主在门口压低声音交锋，镜头从远景推进到近景，最后留一个身份反转。" },
  { title: "道具反转", image: "assets/lantern-face.webp", meta: "关键道具", prompt: "用一个灯笼作为关键道具，女主通过灯笼里的暗号识破陷害，镜头强调手部动作和眼神变化。" },
  { title: "场记拆条", image: "assets/slate-table.webp", meta: "镜头编号", prompt: "把一个 15 秒复仇钩子拆成 5 个可拍镜头，输出镜头编号、画面、动作、声音和返工风险。" },
  { title: "镜头语言", image: "assets/clapper-close.webp", meta: "拍摄参数", prompt: "同一场身份揭示戏，输出 35mm、低机位、手持推进的电影感提示词，并说明不要 BGM。" },
  { title: "场景母图", image: "assets/pavilion-day.webp", meta: "资产沉淀", prompt: "根据古建场景母图生成短剧场景资产说明，锁定空间结构、光线、色彩和可复用镜头角度。" }
];

function updateMode(mode, shouldSave = true) {
  state.mode = mode;
  modeButtons.forEach((button) => button.classList.toggle("active", button.dataset.mode === mode));
  modelField.style.display = mode === "agent" ? "none" : "grid";
  durationField.style.display = mode === "video" || mode === "agent" ? "grid" : "none";
  if (shouldSave) saveSettings();
}

function renderPoints() {
  pointsValue.textContent = state.points.toLocaleString("zh-CN");
}

function renderCases() {
  caseGrid.innerHTML = cases
    .map(
      (item, index) => `
        <article class="case-card">
          <button type="button" data-case="${index}" aria-label="使用${escapeHtml(item.title)}案例"></button>
          <img src="${item.image}" alt="${escapeHtml(item.title)}案例图" loading="lazy" />
          <span><b>${escapeHtml(item.title)}</b><small>${escapeHtml(item.meta)}</small></span>
        </article>
      `
    )
    .join("");

  [...caseGrid.querySelectorAll("[data-case]")].forEach((button) => {
    button.addEventListener("click", () => {
      const item = cases[Number(button.dataset.case)];
      if (!item) return;
      promptInput.value = item.prompt;
      updateMode("agent");
      document.querySelector("#create").scrollIntoView({ behavior: "smooth", block: "start" });
      promptInput.focus({ preventScroll: true });
    });
  });
}

function loadHistory() {
  try {
    const saved = JSON.parse(localStorage.getItem(historyKey) || "[]");
    state.history = Array.isArray(saved) ? saved.slice(0, 8) : [];
  } catch {
    state.history = [];
  }
  renderHistory();
}

function saveHistory() {
  try {
    localStorage.setItem(historyKey, JSON.stringify(state.history.slice(0, 8)));
  } catch {
    // History is a convenience feature; generation must keep working without it.
  }
}

function addHistory(entry) {
  state.history = [
    {
      id: Date.now(),
      createdAt: new Date().toLocaleString("zh-CN", { hour12: false }),
      ...entry
    },
    ...state.history
  ].slice(0, 8);
  saveHistory();
  renderHistory();
}

function renderHistory() {
  if (!state.history.length) {
    historyList.innerHTML = `<div class="history-empty">暂无生成记录</div>`;
    return;
  }

  historyList.innerHTML = state.history
    .map(
      (item, index) => `
        <button class="history-item" type="button" data-history="${index}">
          <b>${escapeHtml(item.prompt || "未命名任务")}</b>
          <span>${escapeHtml(item.createdAt || "")} · ${escapeHtml(item.mode || "agent")} · ${item.degraded ? "备用演示" : "真实生成"}</span>
        </button>
      `
    )
    .join("");

  [...historyList.querySelectorAll("[data-history]")].forEach((button) => {
    button.addEventListener("click", () => {
      const item = state.history[Number(button.dataset.history)];
      if (!item) return;
      promptInput.value = item.prompt || promptInput.value;
      resultBody.classList.remove("loading");
      resultBody.textContent = item.result || "";
      state.lastResult = item.result || "";
      showToast("已恢复历史结果");
    });
  });
}

function renderPreviewResult() {
  if (state.lastResult) return;
  state.lastResult = previewResult;
  resultBody.classList.remove("loading");
  resultBody.textContent = previewResult;
}

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(settingsKey) || "{}");
    if (saved.ratio) ratioSelect.value = saved.ratio;
    if (saved.resolution) resolutionSelect.value = saved.resolution;
    if (saved.duration) durationSelect.value = saved.duration;
    if (saved.prompt) promptInput.value = saved.prompt;
    if (saved.mode) updateMode(saved.mode, false);
  } catch {
    updateMode("agent", false);
  }
}

function saveSettings() {
  try {
    localStorage.setItem(settingsKey, JSON.stringify({
      mode: state.mode,
      ratio: ratioSelect.value,
      resolution: resolutionSelect.value,
      duration: durationSelect.value,
      prompt: promptInput.value
    }));
  } catch {
    // Persistence is optional.
  }
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("sw.js").then((registration) => {
    registration.update().catch(() => {});
    registration.addEventListener("updatefound", () => {
      const worker = registration.installing;
      if (!worker) return;
      worker.addEventListener("statechange", () => {
        if (worker.state === "installed" && navigator.serviceWorker.controller) {
          showToast("新版缓存已准备好");
        }
      });
    });
  }).catch(() => {});
}

function renderThumbs() {
  thumbRow.innerHTML = state.refs
    .map(
      (ref, index) => `
        <div class="thumb" title="${escapeHtml(ref.name)}">
          <img src="${ref.url}" alt="参考图${index + 1}" />
          <span class="badge">${index + 1}</span>
          <button type="button" data-remove="${index}" aria-label="删除参考图${index + 1}">×</button>
        </div>
      `
    )
    .join("");

  [...thumbRow.querySelectorAll("[data-remove]")].forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.remove);
      URL.revokeObjectURL(state.refs[index].url);
      state.refs.splice(index, 1);
      renderThumbs();
      renderReferenceMenu();
    });
  });
}

function renderReferenceMenu() {
  if (!state.refs.length) {
    referenceMenu.innerHTML = `<button type="button" data-token="@">@ 插入引用符</button>`;
  } else {
    referenceMenu.innerHTML = state.refs
      .map((ref, index) => `<button type="button" data-token="@参考图${index + 1}">@参考图${index + 1} ${escapeHtml(ref.name)}</button>`)
      .join("");
  }

  [...referenceMenu.querySelectorAll("[data-token]")].forEach((button) => {
    button.addEventListener("click", () => {
      insertAtCursor(promptInput, `${button.dataset.token} `);
      referenceMenu.classList.remove("open");
      promptInput.focus();
    });
  });
}

function addFiles(files) {
  [...files].filter((file) => file.type.startsWith("image/")).forEach((file) => {
    state.refs.push({
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      inserted: promptInput.value.includes(`@参考图${state.refs.length + 1}`)
    });
  });
  renderThumbs();
  renderReferenceMenu();
}

function insertAtCursor(input, text) {
  const start = input.selectionStart || 0;
  const end = input.selectionEnd || 0;
  input.value = input.value.slice(0, start) + text + input.value.slice(end);
  input.selectionStart = input.selectionEnd = start + text.length;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderBusyProgress() {
  const activeIndex = state.busyIndex % busySteps.length;
  resultBody.innerHTML = `
    <div class="result-progress" aria-live="polite">
      <strong>主控正在处理：${escapeHtml(busySteps[activeIndex])}</strong>
      <div class="progress-steps">
        ${busySteps.map((step, index) => `<span class="${index <= activeIndex ? "active" : ""}">${escapeHtml(step)}</span>`).join("")}
      </div>
    </div>
  `;
  runMeta.textContent = `请求已发送 · ${busySteps[activeIndex]}`;
}

function startBusyProgress() {
  clearInterval(state.busyTimer);
  state.busyIndex = 0;
  renderBusyProgress();
  state.busyTimer = setInterval(() => {
    state.busyIndex += 1;
    renderBusyProgress();
  }, 1800);
}

function stopBusyProgress() {
  clearInterval(state.busyTimer);
  state.busyTimer = null;
}

function setBusy(isBusy) {
  createButton.disabled = isBusy;
  regenerateButton.disabled = isBusy;
  demoRunButton.disabled = isBusy;
  resultBody.classList.toggle("loading", isBusy);
  runState.classList.toggle("busy", isBusy);
  runState.lastChild.textContent = isBusy ? "生成中" : "待创作";
  if (isBusy) {
    startBusyProgress();
  } else {
    stopBusyProgress();
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("open");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("open"), 1800);
}

async function copyText(text, successMessage = "已复制") {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage);
  } catch {
    showToast(text.slice(0, 180));
  }
}

function buildResultSummary() {
  const prompt = promptInput.value.trim() || "未填写";
  const result = state.lastResult || previewResult;
  const lines = result.split("\n").map((line) => line.trim()).filter(Boolean);
  const highlights = lines
    .filter((line) => !line.startsWith("【"))
    .slice(0, 6)
    .join("\n");
  return [
    "AI短剧生产主控体验摘要",
    `客户入口：${githubPagesEntry}`,
    `任务：${prompt}`,
    `状态：${runMeta.textContent || "等待生成"}`,
    "",
    "核心输出：",
    highlights || "已生成主控方案。",
    "",
    "适合给客户看的价值点：",
    "1. 自动判断输入类型并选择生产模式。",
    "2. 把剧本、角色、场景、视频提示词和返工诊断拆成独立节点。",
    "3. API 不可达时仍能返回可演示方案，不让页面空白。"
  ].join("\n");
}

function buildCustomerEntryText() {
  return [
    "AI短剧生产主控客户体验入口：",
    githubPagesEntry,
    "",
    "打不开时备用入口：",
    ...customerEntries.slice(1).map(([label, url]) => `${label}：${url}`),
    "",
    "建议：如果微信内打不开，请复制到手机 Chrome / Safari 打开。"
  ].join("\n");
}

function buildCustomerPitchText() {
  return [
    "给你一个 AI短剧生产主控体验入口：",
    githubPagesEntry,
    "",
    "你可以直接点“一键演示”看它怎么把参考图、角色、场景、镜头和返工诊断拆成独立节点。体验版默认走稳定演示，正式部署后再接真实云端生成。",
    "",
    "如果微信里打不开，复制到手机 Chrome / Safari；备用入口在页面顶部可以一键复制。"
  ].join("\n");
}

function buildDemoScriptText() {
  return [
    "AI短剧生产主控 30 秒演示话术",
    "",
    "这个页面不是单一生成器，而是短剧生产主控。它会先判断输入类型，再把任务拆给独立节点：剧本改编、角色资产、场景资产、视频提示词和返工诊断。",
    "",
    "你可以点“一键演示”看流程：系统先生成一个最小可生产单元，不会一口气处理整部剧；每个节点后续都可以单独升级、替换和返工。",
    "",
    "对客户的价值：素材不乱、角色不漂、场景可复用、失败知道回哪一步改，适合后面接积分、资产库、批量生产和团队协作。"
  ].join("\n");
}

function buildRequirementBriefText() {
  return [
    "AI短剧生产主控需求采集表",
    "",
    "1. 题材类型：古风 / 都市 / 玄幻 / 甜宠 / 悬疑 / 其他",
    "2. 目标平台：抖音 / 快手 / 视频号 / 小红书 / 海外平台",
    "3. 单条时长：5 秒 / 10 秒 / 15 秒 / 30 秒",
    "4. 画幅：9:16 / 16:9 / 1:1 / 其他",
    "5. 是否已有素材：小说 / 剧本 / 角色图 / 场景图 / 成片参考",
    "6. 角色数量：主角、配角、反派分别几个",
    "7. 是否需要资产库：角色库 / 场景库 / 道具库 / 镜头库 / 提示词库",
    "8. 是否需要账号体系：客户登录 / 积分充值 / 任务历史 / 下载记录",
    "9. 预计日生产量：多少条视频或分镜",
    "10. 第一阶段目标：演示验证 / 内部试用 / 客户交付 / 正式商业化"
  ].join("\n");
}

function buildLaunchChecklistText() {
  return [
    "AI短剧生产主控正式上线清单",
    "",
    "基础设施：正式域名、Cloudflare 或海外云服务器、HTTPS、备份入口。",
    "账号与权限：登录、客户空间、管理员后台、角色权限、任务隔离。",
    "积分与支付：积分套餐、扣费规则、充值记录、退款/补偿规则。",
    "资产库：角色资产、场景资产、道具资产、提示词模板、返工记录。",
    "AI 接口：服务端 API Key、模型路由、超时兜底、限流、错误日志。",
    "生产流程：主控节点、独立 Agent 节点、批量任务、质检和返工闭环。",
    "安全合规：Key 不下发前端、上传限制、日志脱敏、访问诊断。",
    "交付验收：手机端打开、微信外打开、备用入口、真实生成、API 失败兜底。"
  ].join("\n");
}

function buildFollowupText() {
  return [
    "体验后跟进话术",
    "",
    "你刚才看到的是 AI短剧生产主控的体验版，重点不是单次生成，而是把短剧生产拆成可管理的节点。",
    "",
    "下一步我建议先拿你们 1 个真实题材做小样：1 个主角、1 个场景、3 条 10 秒竖屏钩子。我们先验证角色稳定、场景复用和返工效率，再决定是否接正式域名、账号体系、积分和资产库。",
    "",
    "你可以先发：题材方向、参考视频、角色设定、已有图片素材、想投放的平台。"
  ].join("\n");
}

function buildPilotOfferText() {
  return [
    "AI短剧生产主控试点方案",
    "",
    "目标：先用真实题材验证流程，不一开始做大系统。",
    "",
    "试点范围：",
    "1. 1 个主角：锁定脸型、发型、服装、气质和禁用项。",
    "2. 1 个场景：沉淀场景母图、光线、色彩、可复用镜头角度。",
    "3. 3 条 10 秒竖屏钩子：每条包含开局冲突、镜头拆解、视频提示词和返工判断。",
    "",
    "验收标准：",
    "角色不乱漂，场景可复用，失败知道回哪个节点返工，客户能看懂每一步产出。",
    "",
    "试点跑通后再做正式版：域名、海外服务器、登录、积分、资产库、批量任务、API 日志、权限和安全策略。"
  ].join("\n");
}

function buildExperienceGuideText() {
  return [
    "AI短剧生产主控客户体验步骤",
    "",
    "1. 打开入口：优先打开 https://yu911517778-a11y.github.io/，微信里打不开就复制到手机 Chrome / Safari。",
    "2. 看稳定演示：点击“一键演示”，先看系统如何拆成剧本、角色、场景、视频提示词和返工诊断节点。",
    "3. 换真实题材：点击页面作品案例，或直接改输入框里的题材，看同一套主控流程如何复用。",
    "4. 看输出结构：确认结果里是否包含输入类型判断、处理范围、调用节点、资产需求、生成方案和返工方向。",
    "5. 进入试点：把素材提交包发给我们，先做 1 个主角、1 个场景、3 条 10 秒竖屏钩子。",
    "",
    "体验版默认走稳定演示，不依赖临时 Worker；正式部署后再接真实云端生成、账号、积分和资产库。"
  ].join("\n");
}

function buildMaterialPackText() {
  return [
    "AI短剧生产主控素材提交包",
    "",
    "请按下面格式发资料，越完整越容易快速做出试点小样。",
    "",
    "1. 题材方向：古风 / 都市 / 玄幻 / 甜宠 / 悬疑 / 其他。",
    "2. 目标平台：抖音 / 快手 / 视频号 / 小红书 / 海外平台。",
    "3. 参考视频：发 3 条你想对标的视频链接，并说明喜欢它的开头、人物、节奏还是画面。",
    "4. 主角资料：性别、年龄感、性格、服装、发型、不能变的特征；有图请发图。",
    "5. 场景资料：主要场景、时代背景、光线氛围、可复用地点；有图请发图。",
    "6. 剧情素材：小说片段、口播文案、故事大纲或一句话钩子都可以。",
    "7. 输出要求：每条时长、画幅、是否需要配音、是否不要 BGM、是否需要字幕。",
    "8. 试点目标：先验证角色稳定、场景复用、批量速度、客户展示，还是正式商业化。",
    "",
    "建议第一轮只做：1 个主角、1 个场景、3 条 10 秒竖屏钩子。"
  ].join("\n");
}

function buildClientChecklistText() {
  return [
    "AI短剧生产主控客户验收清单",
    "",
    "打开体验：手机能打开主入口；微信打不开时能复制到 Chrome / Safari。",
    "演示结果：点击“一键演示”后 1 秒左右出现主控结果，不出现空白页。",
    "流程理解：能看懂主控把任务拆成剧本、角色、场景、视频提示词和返工诊断。",
    "素材复用：能看懂角色图、场景图、镜头参考图分别负责什么。",
    "返工闭环：能看懂失败时回到哪个节点改，而不是盲目重跑。",
    "试点准备：客户能提供题材、角色、场景、参考视频和目标平台。",
    "正式部署：确认是否需要正式域名、海外服务器、账号体系、积分充值、资产库和 API 日志。"
  ].join("\n");
}

function buildDiagnosticReport() {
  return [
    "AI短剧生产主控访问诊断",
    `时间：${new Date().toLocaleString("zh-CN", { hour12: false })}`,
    `当前入口：${window.location.href.split("#")[0]}`,
    ...customerEntries.map(([label, url]) => `${label}：${url}`),
    `云端 API 入口：${primaryWorkerEntry}`,
    `服务状态：${serviceText.textContent || ""}`,
    `API：${apiRouteText.textContent || ""} / ${apiRouteMeta.textContent || ""}`,
    `缓存：${cacheText.textContent || ""} / ${cacheMeta.textContent || ""}`,
    `最近生成：${runMeta.textContent || ""}`,
    `最近请求：${state.lastRun?.requestId || "无"}`,
    `浏览器：${navigator.userAgent}`,
    "",
    "建议：如果微信内打不开，请复制当前入口到手机 Chrome / Safari 打开；如果 API 显示备用演示，把这段诊断报告发给技术排查。"
  ].join("\n");
}

function setServiceStatus(status, message) {
  state.serviceStatus = status;
  serviceDot.classList.remove("checking", "online", "fallback");
  serviceDot.classList.add(status);
  serviceText.textContent = message;
  footerStatus.textContent = message;
}

function getHealthUrl() {
  return window.location.hostname.endsWith("workers.dev")
    ? new URL("api/health", window.location.href).toString()
    : `${remoteApiBase}/api/health`;
}

async function fetchHealth(timeoutMs = 6500) {
  const healthUrl = getHealthUrl();
  const startedAt = performance.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(healthUrl, { signal: controller.signal });
    if (!response.ok) throw new Error("health check failed");
    const data = await response.json();
    return {
      data,
      url: healthUrl,
      latencyMs: Math.round(performance.now() - startedAt)
    };
  } finally {
    clearTimeout(timer);
  }
}

async function checkService() {
  if (!liveApiEnabled) {
    setServiceStatus("fallback", "稳定演示模式");
    return;
  }

  try {
    await fetchHealth();
    setServiceStatus("online", "生成服务在线");
  } catch {
    setServiceStatus("fallback", "备用演示可用");
  }
}

async function runAccessDiagnostics(shouldToast = false) {
  const currentUrl = window.location.href.split("#")[0];
  currentEntryText.textContent = window.location.hostname || "本地预览";
  currentEntryMeta.textContent = currentUrl;
  apiRouteText.textContent = "检测中";
  apiRouteMeta.textContent = "正在检测云端生成通道";
  cacheText.textContent = "检测中";
  cacheMeta.textContent = "正在检测离线缓存版本";

  if (!liveApiEnabled) {
    apiRouteText.textContent = "演示模式";
    apiRouteMeta.textContent = "客户侧不依赖临时 Worker，正式云端部署后启用真实生成";
  } else {
    try {
      const health = await fetchHealth(8000);
      const apiHost = new URL(health.url).hostname;
      apiRouteText.textContent = "在线";
      apiRouteMeta.textContent = `${apiHost} · ${health.latencyMs}ms · V${health.data?.version || "0.8"}`;
    } catch {
      apiRouteText.textContent = "备用演示";
      apiRouteMeta.textContent = "当前网络访问云端受限，页面会自动返回体验结果";
    }
  }

  if ("caches" in window) {
    try {
      const keys = await caches.keys();
      const activeCache = keys.find((key) => key === expectedCacheName) || keys.find((key) => key.startsWith("short-drama-studio"));
      cacheText.textContent = activeCache ? "已启用" : "未命中";
      cacheMeta.textContent = activeCache || "首次打开后会自动写入缓存";
    } catch {
      cacheText.textContent = "不可用";
      cacheMeta.textContent = "当前浏览器限制缓存读取";
    }
  } else {
    cacheText.textContent = "不可用";
    cacheMeta.textContent = "当前浏览器不支持 Cache Storage";
  }

  if (shouldToast) showToast("访问状态已更新");
}

function getApiCandidates() {
  const sameOrigin = new URL("api/create", window.location.href).toString();
  if (!liveApiEnabled) {
    return [];
  }
  if (state.serviceStatus !== "online") {
    return [];
  }
  if (window.location.hostname.endsWith("workers.dev") || window.location.hostname === "127.0.0.1") {
    return [{ url: sameOrigin, timeoutMs: 45000 }];
  }
  return [{ url: `${remoteApiBase}/api/create`, timeoutMs: 45000 }];
}

async function postJsonWithTimeout(url, payload, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    const data = await response.json();
    if (!data.ok) throw new Error(data.error || "生成失败");
    return data;
  } finally {
    clearTimeout(timer);
  }
}

async function requestCreate(payload) {
  const startedAt = performance.now();
  const errors = [];
  const candidates = getApiCandidates();
  for (const endpoint of candidates) {
    try {
      return await postJsonWithTimeout(endpoint.url, payload, endpoint.timeoutMs);
    } catch (error) {
      errors.push(error.message);
    }
  }
  const fallbackWarning = errors[0] || (candidates.length ? "云端生成失败" : "体验版默认稳定演示模式");
  return {
    ok: true,
    degraded: true,
    result: buildDemoResult(payload, fallbackWarning),
    usage: { estimatedPoints: payload.mode === "video" ? 260 : payload.mode === "image" ? 80 : 160 },
    meta: {
      requestId: "local-fallback",
      latencyMs: Math.round(performance.now() - startedAt),
      promptLength: payload.prompt.length,
      references: payload.references.length
    }
  };
}

function buildDemoResult(input, warning) {
  const refs = Array.isArray(input.references) && input.references.length
    ? input.references.map((item, index) => `参考图${index + 1}：${item.name || item.label || "未命名"}，职责：锁定角色、场景、道具或画风中的有效信息。`).join("\n")
    : "本轮未上传参考图，先按文字设定生成可执行分镜方案。";

  return [
    "【输入类型判断】",
    `类型：${input.mode === "video" ? "视频生成任务" : input.mode === "image" ? "图片生成任务" : "AI短剧主控任务"}`,
    `用户输入：${input.prompt}`,
    "",
    "【自动选择的输出模式】",
    "标准生产模式：先做最小可生产单元，再进入节点队列。",
    "",
    "【当前处理范围】",
    `画幅：${input.ratio}；分辨率：${input.resolution}；时长：${input.duration}。`,
    "本轮只处理 1 条 5-15 秒短剧分镜，不一次性处理整集。",
    "",
    "【调用节点】",
    "N01 剧本改编 -> N02 角色资产 -> N03 场景资产 -> N06 视频提示词 -> N10 返工诊断。",
    "",
    "【资产需求】",
    refs,
    "",
    "【可直接执行的生成方案】",
    "镜头 1：玉佩/关键道具特写，使用浅景深制造悬念。",
    "镜头 2：推镜到女主面部，表情压住情绪，光线从侧后方切出轮廓。",
    "镜头 3：女主收起证据，留下反击钩子，不给完整答案。",
    "",
    "【参考图职责】",
    "角色图只管脸型、发型、服装和气质；场景图只管空间、光线和色彩；镜头图只管构图和运动方式。",
    "",
    "【声音要求】",
    "视频阶段不要 BGM，不要配乐；保留环境声、衣料摩擦和道具轻响。",
    "",
    "【质检与返工方向】",
    "角色变脸回 N02；场景不稳定回 N03；动作失败拆成更短镜头；出现字幕、水印或多余文字则重跑负面限制。",
    "",
    "【本轮交付结果】",
    warning ? `已启用客户体验演示结果。原因：${warning}` : "已生成客户体验方案。",
    "下一步建议：先锁定角色标准图和场景母图，再批量生成视频提示词。"
  ].join("\n");
}

async function createWork() {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    resultBody.textContent = "请先输入创作内容。";
    return;
  }

  setBusy(true);
  referenceMenu.classList.remove("open");

  try {
    const startedAt = performance.now();
    const data = await requestCreate({
      mode: state.mode,
      ratio: ratioSelect.value,
      resolution: resolutionSelect.value,
      duration: durationSelect.value,
      prompt,
      references: state.refs.map((ref, index) => ({
        name: ref.name,
        type: ref.type,
        label: `参考图${index + 1}`,
        inserted: prompt.includes(`@参考图${index + 1}`)
      }))
    });

    state.lastResult = data.result;
    resultBody.classList.remove("loading");
    resultBody.textContent = data.result;
    setServiceStatus(data.degraded ? "fallback" : "online", data.degraded ? "备用演示已启用" : "生成服务在线");
    const latency = data.meta?.latencyMs ?? Math.round(performance.now() - startedAt);
    const requestId = data.meta?.requestId || "local";
    state.lastRun = {
      requestId,
      latencyMs: latency,
      degraded: Boolean(data.degraded),
      createdAt: new Date().toLocaleString("zh-CN", { hour12: false })
    };
    runMeta.textContent = `${data.degraded ? "备用演示" : "真实生成"} · ${Math.max(1, Math.round(latency / 1000))} 秒 · ${requestId}`;
    addHistory({
      mode: state.mode,
      prompt,
      result: data.result,
      degraded: Boolean(data.degraded),
      requestId,
      latencyMs: latency
    });
    if (data.usage?.estimatedPoints) {
      state.points = Math.max(0, state.points - data.usage.estimatedPoints);
      renderPoints();
    }
  } catch (error) {
    resultBody.classList.remove("loading");
    resultBody.textContent = `生成失败：${error.message}`;
    runMeta.textContent = "生成失败，可点击重试";
  } finally {
    setBusy(false);
  }
}

async function runInstantDemo() {
  const demoCase = cases[0];
  promptInput.value = demoCase.prompt;
  ratioSelect.value = "9:16";
  resolutionSelect.value = "720P";
  durationSelect.value = "10秒";
  updateMode("agent");
  saveSettings();
  showToast("已载入客户演示案例");
  await createWork();
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => updateMode(button.dataset.mode));
});

[ratioSelect, resolutionSelect, durationSelect, promptInput].forEach((input) => {
  input.addEventListener("input", saveSettings);
  input.addEventListener("change", saveSettings);
});

uploadButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", () => addFiles(fileInput.files));

dropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropZone.classList.add("dragging");
});

dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragging"));

dropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropZone.classList.remove("dragging");
  addFiles(event.dataTransfer.files);
});

referenceButton.addEventListener("click", () => {
  renderReferenceMenu();
  referenceMenu.classList.toggle("open");
});

createButton.addEventListener("click", createWork);
regenerateButton.addEventListener("click", createWork);
demoRunButton.addEventListener("click", runInstantDemo);

summaryButton.addEventListener("click", () => {
  copyText(buildResultSummary(), "演示摘要已复制");
});

copyButton.addEventListener("click", async () => {
  if (!state.lastResult) return;
  await copyText(state.lastResult, "主控结果已复制");
  copyButton.textContent = "已复制";
  setTimeout(() => {
    copyButton.textContent = "复制";
  }, 1200);
});

downloadButton.addEventListener("click", () => {
  if (!state.lastResult) {
    showToast("请先生成主控结果");
    return;
  }
  const blob = new Blob([state.lastResult], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `AI短剧主控结果-${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  showToast("结果文件已生成");
});

noticeButton.addEventListener("click", () => {
  noticePopover.classList.toggle("open");
});

shareButton.addEventListener("click", async () => {
  copyText(buildCustomerEntryText(), "客户入口已复制");
});

copyHandoffButton.addEventListener("click", async () => {
  copyText(buildCustomerEntryText(), "客户入口已复制");
});

copyPitchButton.addEventListener("click", async () => {
  copyText(buildCustomerPitchText(), "转发文案已复制");
});

copyDemoScriptButton.addEventListener("click", async () => {
  copyText(buildDemoScriptText(), "演示话术已复制");
});

copyBriefButton.addEventListener("click", async () => {
  copyText(buildRequirementBriefText(), "需求表已复制");
});

copyLaunchButton.addEventListener("click", async () => {
  copyText(buildLaunchChecklistText(), "上线清单已复制");
});

copyFollowupButton.addEventListener("click", async () => {
  copyText(buildFollowupText(), "跟进话术已复制");
});

copyPilotButton.addEventListener("click", async () => {
  copyText(buildPilotOfferText(), "试点方案已复制");
});

copyExperienceGuideButton.addEventListener("click", async () => {
  copyText(buildExperienceGuideText(), "体验步骤已复制");
});

copyMaterialPackButton.addEventListener("click", async () => {
  copyText(buildMaterialPackText(), "素材提交包已复制");
});

copyClientChecklistButton.addEventListener("click", async () => {
  copyText(buildClientChecklistText(), "验收清单已复制");
});

copyMobileEntryButton.addEventListener("click", async () => {
  copyText(githubPagesEntry, "扫码链接已复制");
});

openRootEntryButton.addEventListener("click", () => {
  window.open(githubPagesEntry, "_blank", "noopener,noreferrer");
});


openMirrorButton.addEventListener("click", () => {
  window.open(primaryWorkerEntry, "_blank", "noopener,noreferrer");
});

handoffDemoButton.addEventListener("click", async () => {
  document.querySelector("#create").scrollIntoView({ behavior: "smooth", block: "start" });
  await runInstantDemo();
});

copyCurrentButton.addEventListener("click", async () => {
  const url = window.location.href.split("#")[0];
  copyText(url, "当前入口已复制");
});

copyBackupButton.addEventListener("click", async () => {
  copyText(buildCustomerEntryText(), "全部入口已复制");
});

copyDiagnosticButton.addEventListener("click", async () => {
  await runAccessDiagnostics();
  copyText(buildDiagnosticReport(), "诊断报告已复制");
});

diagnosticButton.addEventListener("click", () => runAccessDiagnostics(true));

clearHistoryButton.addEventListener("click", () => {
  state.history = [];
  saveHistory();
  renderHistory();
  showToast("历史记录已清空");
});

document.addEventListener("click", (event) => {
  if (!referenceMenu.contains(event.target) && event.target !== referenceButton) {
    referenceMenu.classList.remove("open");
  }
  if (!noticePopover.contains(event.target) && !noticeButton.contains(event.target)) {
    noticePopover.classList.remove("open");
  }
});

updateMode("agent", false);
loadSettings();
renderPoints();
renderCases();
renderReferenceMenu();
loadHistory();
renderPreviewResult();
checkService();
runAccessDiagnostics();
registerServiceWorker();
