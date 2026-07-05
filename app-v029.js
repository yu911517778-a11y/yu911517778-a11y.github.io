const state = {
  mode: "image",
  points: 12800,
  refs: [],
  lastResult: "",
  serviceStatus: "fallback",
  cloudReachable: false,
  cloudGenerationMode: "local",
  history: [],
  busyTimer: null,
  busyIndex: 0,
  lastRun: null,
  selectedAgentIndex: 0
};

const primaryWorkerEntry = "https://short-video-agent-demo.meteor-lan.workers.dev/";
const rootPagesEntry = "https://yu911517778-a11y.github.io/";
const projectPagesEntry = "https://yu911517778-a11y.github.io/ai-short-drama-agent-demo/";
const litePagesEntry = `${rootPagesEntry}client-lite-v031.html`;
const launchPagesEntry = `${rootPagesEntry}go.html`;
const accessPagesEntry = `${rootPagesEntry}client-access-v031.html`;
const openPagesEntry = `${rootPagesEntry}client-open-v031.html`;
const statusPagesEntry = `${rootPagesEntry}client-status-v031.html`;
const refreshPagesEntry = `${rootPagesEntry}client-refresh-v031.html`;
const liteTempEntry = "https://litter.catbox.moe/vxxjas.html";
const previewLiteEntry = "https://htmlpreview.github.io/?https://github.com/yu911517778-a11y/yu911517778-a11y.github.io/blob/master/client-lite-v031.html?b=v031-202607051430";
const edgeOneEntry = "https://mcp.edgeone.site/share/YHAP_QFwctWHj9wjNoz3N";
const currentOriginEntry = typeof window !== "undefined" ? `${window.location.origin}/` : primaryWorkerEntry;
const primaryCustomerEntry = typeof window !== "undefined" && window.location.hostname.endsWith("workers.dev") ? currentOriginEntry : primaryWorkerEntry;
const githubProxyEntry = primaryCustomerEntry;
const emergencyMirrorEntry = primaryCustomerEntry;
const githubPagesEntry = litePagesEntry;
const remoteApiBase = primaryWorkerEntry.replace(/\/$/, "");
const historyKey = "shortDramaAgentHistory:v1";
const settingsKey = "shortDramaAgentSettings:v2";
const expectedCacheName = "short-drama-studio-v32";
const liveApiEnabled = true;
const customerEntries = [
  ["商用体验入口", primaryCustomerEntry],
  ["智能启动页", launchPagesEntry],
  ["备用预览", githubPagesEntry],
  ["访问保障页", accessPagesEntry],
  ["极简打开页", openPagesEntry],
  ["网络自检页", statusPagesEntry],
  ["刷新缓存页", refreshPagesEntry],
  ["访问保障备用", `${primaryWorkerEntry}client-access-v031.html`],
  ["智能启动备用", `${primaryWorkerEntry}go.html`],
  ["备用镜像 A", liteTempEntry],
  ["备用镜像 B", previewLiteEntry],
  ["备用镜像 C", `${primaryWorkerEntry}client-lite-v031.html`],
  ["完整 Studio 备用", projectPagesEntry],
  ["短根域名入口", `${rootPagesEntry}client-entry-v027.html`],
  ["完整 Studio 镜像", `${primaryWorkerEntry}client-entry-v027.html`]
];

const modeButtons = [...document.querySelectorAll("[data-mode]")];
const modeSelect = document.querySelector("#modeSelect");
const ratioSelect = document.querySelector("#ratioSelect");
const resolutionSelect = document.querySelector("#resolutionSelect");
const durationSelect = document.querySelector("#durationSelect");
const modelSelect = document.querySelector("#modelSelect");
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
const maturitySelect = document.querySelector("#maturitySelect");
const materialSelect = document.querySelector("#materialSelect");
const goalSelect = document.querySelector("#goalSelect");
const volumeSelect = document.querySelector("#volumeSelect");
const needAccountCheckbox = document.querySelector("#needAccountCheckbox");
const needPointsCheckbox = document.querySelector("#needPointsCheckbox");
const needAssetsCheckbox = document.querySelector("#needAssetsCheckbox");
const needBatchCheckbox = document.querySelector("#needBatchCheckbox");
const needApiLogCheckbox = document.querySelector("#needApiLogCheckbox");
const estimateScoreText = document.querySelector("#estimateScoreText");
const estimateTierText = document.querySelector("#estimateTierText");
const estimateTitleText = document.querySelector("#estimateTitleText");
const estimateSummaryText = document.querySelector("#estimateSummaryText");
const estimateRiskList = document.querySelector("#estimateRiskList");
const resetEstimateButton = document.querySelector("#resetEstimateButton");
const copyEstimateButton = document.querySelector("#copyEstimateButton");
const copyProposalButton = document.querySelector("#copyProposalButton");
const deployStageSelect = document.querySelector("#deployStageSelect");
const domainModeSelect = document.querySelector("#domainModeSelect");
const serverModeSelect = document.querySelector("#serverModeSelect");
const usageScaleSelect = document.querySelector("#usageScaleSelect");
const deployLoginCheckbox = document.querySelector("#deployLoginCheckbox");
const deployPaymentCheckbox = document.querySelector("#deployPaymentCheckbox");
const deployAssetCheckbox = document.querySelector("#deployAssetCheckbox");
const deployBatchCheckbox = document.querySelector("#deployBatchCheckbox");
const deployAuditCheckbox = document.querySelector("#deployAuditCheckbox");
const deployAdminCheckbox = document.querySelector("#deployAdminCheckbox");
const deployStageText = document.querySelector("#deployStageText");
const deployReadinessText = document.querySelector("#deployReadinessText");
const deployTitleText = document.querySelector("#deployTitleText");
const deploySummaryText = document.querySelector("#deploySummaryText");
const deployActionList = document.querySelector("#deployActionList");
const resetDeployButton = document.querySelector("#resetDeployButton");
const copyDeployPlanButton = document.querySelector("#copyDeployPlanButton");
const copyInfraChecklistButton = document.querySelector("#copyInfraChecklistButton");
const agentNodeGrid = document.querySelector("#agentNodeGrid");
const agentDetailCode = document.querySelector("#agentDetailCode");
const agentDetailTitle = document.querySelector("#agentDetailTitle");
const agentDetailDesc = document.querySelector("#agentDetailDesc");
const agentDetailInput = document.querySelector("#agentDetailInput");
const agentDetailOutput = document.querySelector("#agentDetailOutput");
const agentDetailUpgrade = document.querySelector("#agentDetailUpgrade");
const copyArchitectureButton = document.querySelector("#copyArchitectureButton");
const copyNodeSpecButton = document.querySelector("#copyNodeSpecButton");

const agentNodes = [
  {
    code: "N01",
    title: "剧本改编 Agent",
    short: "故事变成可生产钩子",
    desc: "把小说、口播、故事大纲拆成短剧钩子、冲突点和镜头节奏。",
    input: "题材方向、故事大纲、参考视频、平台风格",
    output: "开局钩子、冲突转折、镜头顺序、负面限制",
    upgrade: "题材模板、爆款结构、平台节奏、审核词规避",
    acceptance: "输出能直接进入角色、场景和视频提示词节点，不需要人工重写。"
  },
  {
    code: "N02",
    title: "角色资产 Agent",
    short: "锁定人物不漂移",
    desc: "沉淀主角、配角、反派的人设、外观、服装、表情和禁用项。",
    input: "角色设定、参考图、年龄感、服装、不能变化的特征",
    output: "角色资产卡、外观提示词、负面词、复用规则",
    upgrade: "人脸一致性、服装系列、表情库、角色版本管理",
    acceptance: "同一角色在多条短剧里保持脸型、气质和服装逻辑一致。"
  },
  {
    code: "N03",
    title: "场景资产 Agent",
    short: "场景母图可复用",
    desc: "把场景参考变成可复用的空间结构、光线、色彩和镜头角度。",
    input: "场景参考图、时代背景、光线氛围、可复用地点",
    output: "场景母图说明、空间结构、光线色彩、角度清单",
    upgrade: "场景库、道具库、镜头角度库、统一美术风格",
    acceptance: "同一场景可支撑多条镜头，不频繁跳变或丢失空间关系。"
  },
  {
    code: "N04",
    title: "分镜拆解 Agent",
    short: "复杂剧情拆成短镜头",
    desc: "把一条钩子拆成更短、更稳、更容易生成和返工的镜头任务。",
    input: "钩子文案、角色资产、场景资产、目标时长",
    output: "镜头编号、画面动作、声音节奏、转场关系",
    upgrade: "平台节奏、镜头模板、批量拆条、镜头复用",
    acceptance: "每个镜头都能独立生成、独立返工，不牵连整条视频。"
  },
  {
    code: "N06",
    title: "视频提示词 Agent",
    short: "生成可执行视频 Prompt",
    desc: "把分镜变成视频模型可执行的镜头语言、运动方式和负面限制。",
    input: "分镜、角色卡、场景卡、画幅、时长、模型类型",
    output: "视频提示词、镜头参数、运动方式、失败规避词",
    upgrade: "不同视频模型适配、提示词 A/B、批量参数模板",
    acceptance: "提示词能稳定表达主体、动作、镜头、光线和禁用项。"
  },
  {
    code: "N10",
    title: "返工诊断 Agent",
    short: "失败知道回哪一层改",
    desc: "判断失败属于角色、场景、动作、镜头、提示词还是模型限制。",
    input: "生成结果、失败描述、原始节点输入、客户反馈",
    output: "失败分类、返工节点、修改建议、是否重跑判断",
    upgrade: "自动质检、失败样本库、返工优先级、成本控制",
    acceptance: "问题能定位到具体节点，不再靠盲目重跑消耗积分。"
  }
];

const estimateOptions = {
  maturity: {
    idea: { label: "只有想法", score: 8 },
    script: { label: "已有剧情 / 小说", score: 18 },
    visual: { label: "已有角色 / 场景图", score: 25 },
    reference: { label: "已有成片参考", score: 30 }
  },
  material: {
    missing: { label: "缺素材", score: 6 },
    partial: { label: "有部分参考图", score: 16 },
    core: { label: "角色场景都有", score: 24 },
    library: { label: "已有资产库", score: 30 }
  },
  goal: {
    demo: { label: "演示验证", score: 8 },
    internal: { label: "内部试用", score: 14 },
    delivery: { label: "客户交付", score: 20 },
    commercial: { label: "商业化上线", score: 26 }
  },
  volume: {
    small: { label: "1-3 条", score: 8 },
    medium: { label: "5-10 条", score: 15 },
    large: { label: "20 条以上", score: 22 }
  }
};

const deployOptions = {
  stage: {
    temporary: { label: "临时体验", score: 8 },
    pilot: { label: "真实题材试点", score: 18 },
    mvp: { label: "MVP 账号积分", score: 28 },
    commercial: { label: "商业化部署", score: 38 }
  },
  domain: {
    temp: { label: "临时入口", score: 4 },
    company: { label: "公司域名", score: 14 },
    multi: { label: "主域名 + 备用入口", score: 18 }
  },
  server: {
    static: { label: "静态页 + Worker", score: 8 },
    light: { label: "海外轻量云", score: 16 },
    vps: { label: "独立 VPS", score: 22 },
    customer: { label: "客户自有云", score: 24 }
  },
  scale: {
    solo: { label: "1 人演示", score: 4 },
    team: { label: "3-5 人团队", score: 12 },
    client: { label: "客户多人使用", score: 18 },
    batch: { label: "批量生产团队", score: 26 }
  }
};

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
  "这是打开页面后的样例方案。点击生成后，会替换为当前输入的真实创作结果。"
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
  const normalizedMode = ["agent", "image", "video"].includes(mode) ? mode : "image";
  const modelByMode = {
    agent: "agent-supervisor",
    image: "image-5-lite",
    video: "video-5-lite"
  };
  state.mode = normalizedMode;
  modeButtons.forEach((button) => button.classList.toggle("active", button.dataset.mode === normalizedMode));
  if (modeSelect) modeSelect.value = normalizedMode;
  if (modelSelect && modelByMode[normalizedMode]) modelSelect.value = modelByMode[normalizedMode];
  if (modelField) modelField.hidden = normalizedMode === "agent";
  if (durationField) durationField.hidden = !(normalizedMode === "video" || normalizedMode === "agent");
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

function renderAgentNodes() {
  agentNodeGrid.innerHTML = agentNodes
    .map((node, index) => `
      <button class="agent-node-card${index === state.selectedAgentIndex ? " active" : ""}" type="button" data-agent-node="${index}">
        <b>${escapeHtml(node.code)}</b>
        <strong>${escapeHtml(node.title.replace(" Agent", ""))}</strong>
        <span>${escapeHtml(node.short)}</span>
      </button>
    `)
    .join("");

  [...agentNodeGrid.querySelectorAll("[data-agent-node]")].forEach((button) => {
    button.addEventListener("click", () => {
      selectAgentNode(Number(button.dataset.agentNode));
    });
  });

  renderAgentDetail();
}

function selectAgentNode(index) {
  if (!agentNodes[index]) return;
  state.selectedAgentIndex = index;
  renderAgentNodes();
}

function getSelectedAgentNode() {
  return agentNodes[state.selectedAgentIndex] || agentNodes[0];
}

function renderAgentDetail() {
  const node = getSelectedAgentNode();
  agentDetailCode.textContent = node.code;
  agentDetailTitle.textContent = node.title;
  agentDetailDesc.textContent = node.desc;
  agentDetailInput.textContent = node.input;
  agentDetailOutput.textContent = node.output;
  agentDetailUpgrade.textContent = node.upgrade;
}

function buildArchitectureText() {
  return [
    "AI短剧生产主控正式架构说明",
    "",
    "核心原则：主控 Supervisor 只负责任务拆解、上下文路由、结果合并、成本控制和返工判断；生产能力拆成独立智能体节点。",
    "",
    "为什么要这样做：",
    "1. 单个节点升级时，不需要重做整套系统。",
    "2. 角色、场景、分镜、视频提示词和返工诊断可以分别验收。",
    "3. 某个模型或节点失败时，只回退对应节点，不盲目重跑全部流程。",
    "4. 后续接账号、积分、资产库和批量任务时，模块边界更清晰。",
    "",
    "建议第一阶段节点：",
    ...agentNodes.map((node) => `${node.code} ${node.title}：${node.output}`),
    "",
    "试点验收：先用 1 个主角、1 个场景、3 条 10 秒竖屏钩子，验证角色稳定、场景复用、提示词可执行和返工定位。"
  ].join("\n");
}

function buildNodeSpecText() {
  const node = getSelectedAgentNode();
  return [
    `AI短剧生产主控节点升级方案：${node.code} ${node.title}`,
    "",
    `节点定位：${node.desc}`,
    `输入：${node.input}`,
    `输出：${node.output}`,
    `可独立升级：${node.upgrade}`,
    `验收标准：${node.acceptance}`,
    "",
    "落地方式：把该节点做成独立智能体，保留固定输入输出协议；主控只调用协议，不绑定具体实现。后续换模型、调提示词、加素材库或加质检规则时，只改这个节点。"
  ].join("\n");
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
  let savedMode = "image";
  try {
    const saved = JSON.parse(localStorage.getItem(settingsKey) || "{}");
    if (saved.ratio) ratioSelect.value = saved.ratio;
    if (saved.resolution) resolutionSelect.value = saved.resolution;
    if (saved.duration) durationSelect.value = saved.duration;
    if (saved.prompt) promptInput.value = saved.prompt;
    if (saved.mode) savedMode = saved.mode;
    updateMode(savedMode, false);
    if (saved.model && modelSelect) modelSelect.value = saved.model;
  } catch {
    updateMode("image", false);
  }
}

function saveSettings() {
  try {
    localStorage.setItem(settingsKey, JSON.stringify({
      mode: state.mode,
      ratio: ratioSelect.value,
      resolution: resolutionSelect.value,
      duration: durationSelect.value,
      model: modelSelect ? modelSelect.value : "",
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
    if (!navigator.clipboard?.writeText) {
      throw new Error("Clipboard API unavailable");
    }
    await navigator.clipboard.writeText(text);
    showToast(successMessage);
  } catch {
    if (copyTextFallback(text)) {
      showToast(successMessage);
      return;
    }
    showToast(text.slice(0, 180));
  }
}

function copyTextFallback(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
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
    "AI短剧创作平台体验摘要",
    `体验入口：${primaryCustomerEntry}`,
    `备用预览：${githubPagesEntry}`,
    `任务：${prompt}`,
    `状态：${runMeta.textContent || "等待生成"}`,
    "",
    "核心输出：",
    highlights || "已生成主控方案。",
    "",
    "适合给客户看的价值点：",
    "1. 自动判断输入类型并选择生产模式。",
    "2. 把剧本、角色、场景、视频提示词和返工诊断拆成独立节点。",
    "3. 云端繁忙时仍能返回可演示方案，不让页面空白。"
  ].join("\n");
}

function buildCustomerEntryText() {
  return [
    "AI短剧创作平台商用体验入口包",
    "",
    `商用体验入口：${primaryCustomerEntry}`,
    `智能启动页：${launchPagesEntry}`,
    `备用预览：${githubPagesEntry}`,
    `访问保障页：${accessPagesEntry}`,
    "",
    "访问保障：",
    ...customerEntries.slice(3).map(([label, url]) => `${label}：${url}`),
    "",
    "建议：优先发送商用体验入口；客户说打不开时，发智能启动页或访问保障页。"
  ].join("\n");
}

function buildCustomerPitchText() {
  return [
    "给你一个 AI短剧创作平台商用体验入口：",
    primaryCustomerEntry,
    "",
    "打开后可以直接上传参考图、选择生成参数、输入剧情或角色设定，看系统如何把剧本、角色、场景、视频提示词和返工诊断拆成独立智能体节点。",
    "",
    `备用预览：${githubPagesEntry}`,
    `智能启动页：${launchPagesEntry}`,
    `访问保障页：${accessPagesEntry}`
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

function getEstimateInput() {
  const needs = [
    { key: "account", label: "账号体系", checked: needAccountCheckbox.checked },
    { key: "points", label: "积分充值", checked: needPointsCheckbox.checked },
    { key: "assets", label: "资产库", checked: needAssetsCheckbox.checked },
    { key: "batch", label: "批量任务", checked: needBatchCheckbox.checked },
    { key: "apiLog", label: "API 日志", checked: needApiLogCheckbox.checked }
  ];

  return {
    maturity: estimateOptions.maturity[maturitySelect.value],
    material: estimateOptions.material[materialSelect.value],
    goal: estimateOptions.goal[goalSelect.value],
    volume: estimateOptions.volume[volumeSelect.value],
    maturityKey: maturitySelect.value,
    materialKey: materialSelect.value,
    goalKey: goalSelect.value,
    volumeKey: volumeSelect.value,
    needs,
    selectedNeeds: needs.filter((item) => item.checked)
  };
}

function calculateEstimate() {
  const input = getEstimateInput();
  const needCount = input.selectedNeeds.length;
  let score = input.maturity.score + input.material.score + input.goal.score + input.volume.score;

  if (input.selectedNeeds.some((item) => item.key === "assets")) score += 2;
  if (input.materialKey === "library") score += 4;
  if (input.goalKey === "commercial") score += 4;
  if (input.volumeKey === "large" && input.materialKey !== "library") score -= 7;
  if (needCount >= 4 && input.materialKey === "missing") score -= 8;
  score = Math.max(35, Math.min(96, score));

  let tier = "轻量试点";
  let title = "先补素材再做小样";
  let summary = "建议先收齐题材、主角、场景和参考视频，再做 1 条 10 秒竖屏钩子验证方向。";
  let deliverables = [
    "1 个主角设定",
    "1 个基础场景",
    "1 条 10 秒竖屏钩子",
    "1 份返工判断记录"
  ];

  if (score >= 58) {
    tier = "标准试点";
    title = "适合进入真实题材试点";
    summary = "建议用 1 个主角、1 个场景、3 条 10 秒竖屏钩子验证角色稳定、场景复用和返工效率。";
    deliverables = [
      "1 个主角资产卡",
      "1 个场景母图方向",
      "3 条 10 秒竖屏钩子",
      "分镜、视频提示词和返工建议"
    ];
  }

  if (score >= 78 || input.goalKey === "commercial" || input.volumeKey === "large" || needCount >= 4) {
    tier = "正式部署前评估";
    title = "先做试点，再拆正式系统范围";
    summary = "生产目标已经接近正式系统，建议先用真实题材跑小样，再确认域名、服务器、账号、积分、资产库、批量任务和日志范围。";
    deliverables = [
      "试点小样和资产复用记录",
      "正式部署模块边界",
      "账号、积分、资产库、批量任务清单",
      "API 兜底、日志和权限建议"
    ];
  }

  const risks = [];
  if (input.maturityKey === "idea") risks.push("题材还停留在想法层，先补一句话钩子、角色关系和冲突点。");
  if (input.materialKey === "missing") risks.push("素材不足会导致角色和场景不稳定，试点前至少补主角图、场景参考和对标视频。");
  if (input.materialKey === "partial") risks.push("已有素材还不完整，第一轮应限制在 1 个主角和 1 个场景内。");
  if (input.volumeKey === "large") risks.push("日产 20 条以上需要批量队列、资产命名、失败重试和扣费日志，不能只靠单页体验版。");
  if (needCount >= 4) risks.push("正式能力需求较多，建议先锁试点验收标准，再拆系统报价和排期。");
  if (!needAssetsCheckbox.checked) risks.push("不做资产库会影响角色复用，后续批量生产容易重复返工。");
  if (risks.length === 0) risks.push("当前条件适合做标准试点，重点看角色是否稳定、场景是否可复用。");

  return { input, score, tier, title, summary, risks: risks.slice(0, 4), deliverables };
}

function renderEstimate() {
  const estimate = calculateEstimate();
  estimateScoreText.textContent = String(estimate.score);
  estimateTierText.textContent = estimate.tier;
  estimateTitleText.textContent = estimate.title;
  estimateSummaryText.textContent = estimate.summary;
  estimateRiskList.innerHTML = estimate.risks.map((risk) => `<li>${escapeHtml(risk)}</li>`).join("");
  return estimate;
}

function buildEstimateReportText() {
  const estimate = calculateEstimate();
  const input = estimate.input;
  return [
    "AI短剧生产主控试点评估报告",
    "",
    `评估分：${estimate.score} / 100`,
    `建议档位：${estimate.tier}`,
    `推荐动作：${estimate.title}`,
    "",
    "客户当前条件：",
    `题材成熟度：${input.maturity.label}`,
    `素材完整度：${input.material.label}`,
    `试点目标：${input.goal.label}`,
    `目标日产量：${input.volume.label}`,
    `正式能力：${input.selectedNeeds.map((item) => item.label).join("、") || "暂不需要"}`,
    "",
    "建议交付：",
    ...estimate.deliverables.map((item, index) => `${index + 1}. ${item}`),
    "",
    "风险提醒：",
    ...estimate.risks.map((item, index) => `${index + 1}. ${item}`),
    "",
    `商用体验入口：${primaryCustomerEntry}`,
      `备用预览：${githubPagesEntry}`,
      `完整体验版：${projectPagesEntry}`
  ].join("\n");
}

function buildEstimateProposalText() {
  const estimate = calculateEstimate();
  const input = estimate.input;
  return [
    "AI短剧生产主控试点跟进方案",
    "",
    `根据刚才的评估，当前更适合走「${estimate.tier}」。`,
    estimate.summary,
    "",
    "建议下一步：",
    "1. 先发题材方向、主角设定、场景参考和 3 条对标视频。",
    `2. 第一轮按「${estimate.deliverables.join("、")}」验收。`,
    "3. 试点跑通后，再确认是否进入正式域名、海外服务器、账号体系、积分充值、资产库、批量任务和 API 日志。",
    "",
    `当前目标：${input.goal.label}；目标日产量：${input.volume.label}。`,
    `体验入口：${primaryCustomerEntry}`,
    `备用预览：${githubPagesEntry}`
  ].join("\n");
}

function getDeployInput() {
  const modules = [
    { key: "login", label: "登录", checked: deployLoginCheckbox.checked },
    { key: "payment", label: "支付积分", checked: deployPaymentCheckbox.checked },
    { key: "asset", label: "资产库", checked: deployAssetCheckbox.checked },
    { key: "batch", label: "任务队列", checked: deployBatchCheckbox.checked },
    { key: "audit", label: "日志审计", checked: deployAuditCheckbox.checked },
    { key: "admin", label: "管理后台", checked: deployAdminCheckbox.checked }
  ];

  return {
    stage: deployOptions.stage[deployStageSelect.value],
    domain: deployOptions.domain[domainModeSelect.value],
    server: deployOptions.server[serverModeSelect.value],
    scale: deployOptions.scale[usageScaleSelect.value],
    stageKey: deployStageSelect.value,
    domainKey: domainModeSelect.value,
    serverKey: serverModeSelect.value,
    scaleKey: usageScaleSelect.value,
    modules,
    selectedModules: modules.filter((item) => item.checked)
  };
}

function calculateDeployPlan() {
  const input = getDeployInput();
  const moduleCount = input.selectedModules.length;
  let score = input.stage.score + input.domain.score + input.server.score + input.scale.score + moduleCount * 4;

  if (input.stageKey === "temporary") score = Math.min(score, 44);
  if (input.stageKey === "commercial" && input.domainKey === "temp") score -= 10;
  if (input.scaleKey === "batch" && input.serverKey === "static") score -= 8;
  if (deployPaymentCheckbox.checked && !deployLoginCheckbox.checked) score -= 6;
  score = Math.max(22, Math.min(96, score));

  let readiness = "临时测试";
  let title = "先用免费入口验证兴趣";
  let summary = "当前适合继续用商用体验入口让客户体验，先不要买服务器，等真实题材试点有反馈后再升级。";
  let actions = [
    "发极速入口给客户，确认是否能打开和理解产品。",
    "收 1 个真实题材、1 个主角、1 个场景和 3 条对标视频。",
    "先跑 3 条 10 秒竖屏钩子，记录角色稳定和返工问题。"
  ];

  if (score >= 48) {
    readiness = "试点准备";
    title = "进入真实题材试点";
    summary = "客户已经进入真实试点意向，建议用真实素材跑小样，同时整理资产命名、返工记录和第一批验收标准。";
    actions = [
      "锁定试点范围：1 个主角、1 个场景、3 条 10 秒竖屏钩子。",
      "建立角色资产卡、场景母图、提示词模板和返工记录。",
      "试点结束后按角色稳定、场景复用、返工次数、客户反馈决定是否进 MVP。"
    ];
  }

  if (score >= 66 || input.stageKey === "mvp") {
    readiness = "MVP 可排期";
    title = "拆 MVP 系统边界";
    summary = "可以开始规划账号、积分、资产库、任务历史和服务端 API key 托管，但仍建议先用试点数据控制范围。";
    actions = [
      "购买或准备公司域名，并配置 HTTPS 和备用入口。",
      "选择海外轻量云或独立 VPS，部署后端 API、任务队列和日志。",
      "实现登录、客户空间、积分扣费、资产库、任务历史和管理员入口。"
    ];
  }

  if (score >= 82 || input.stageKey === "commercial" || input.scaleKey === "batch") {
    readiness = "商业部署";
    title = "按商业系统验收";
    summary = "目标已经接近客户正式使用，需要把域名、服务器、账号、计费、资产库、队列、日志、安全和备份作为一个整体交付。";
    actions = [
      "使用公司域名和海外云服务器，保留至少 1 个备用入口。",
      "把模型 API key 放在服务端 Secret，不进入浏览器。",
      "上线前做限流、日志、备份、错误告警、管理员权限和扣费对账。"
    ];
  }

  const required = [
    input.domainKey === "temp" ? "临时入口和备用链接" : "公司域名、DNS、HTTPS、备用入口",
    input.serverKey === "static" ? "静态页、Worker 兜底、无服务端密钥暴露" : "海外云服务器、进程守护、反向代理、日志目录",
    deployLoginCheckbox.checked ? "登录、客户空间、权限分组" : "演示模式访问控制",
    deployPaymentCheckbox.checked ? "积分套餐、扣费流水、充值/退款规则" : "演示积分和人工结算",
    deployAssetCheckbox.checked ? "角色/场景/道具资产库、命名规范、版本记录" : "最小素材提交包",
    deployBatchCheckbox.checked ? "任务队列、失败重试、并发限制、成本上限" : "单任务生成流程",
    deployAuditCheckbox.checked ? "API 日志、错误日志、操作审计、告警" : "基础诊断报告",
    deployAdminCheckbox.checked ? "管理员后台、客户管理、任务管理" : "人工运营表"
  ];

  return { input, score, readiness, title, summary, actions, required };
}

function renderDeployPlan() {
  const plan = calculateDeployPlan();
  deployStageText.textContent = plan.readiness;
  deployReadinessText.textContent = `${plan.score} / 100`;
  deployTitleText.textContent = plan.title;
  deploySummaryText.textContent = plan.summary;
  deployActionList.innerHTML = plan.actions.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  return plan;
}

function buildDeployPlanText() {
  const plan = calculateDeployPlan();
  const input = plan.input;
  return [
    "AI短剧生产主控正式部署方案",
    "",
    `部署判断：${plan.readiness}（${plan.score}/100）`,
    `建议动作：${plan.title}`,
    "",
    "当前配置：",
    `部署阶段：${input.stage.label}`,
    `域名策略：${input.domain.label}`,
    `服务器策略：${input.server.label}`,
    `使用规模：${input.scale.label}`,
    `启用模块：${input.selectedModules.map((item) => item.label).join("、") || "仅演示模式"}`,
    "",
    "执行步骤：",
    ...plan.actions.map((item, index) => `${index + 1}. ${item}`),
    "",
    "备注：临时测试阶段不把 API key 放到浏览器；正式部署后所有模型 key 进入服务端 Secret。"
  ].join("\n");
}

function buildInfraChecklistText() {
  const plan = calculateDeployPlan();
  return [
    "AI短剧生产主控基础设施清单",
    "",
    "必须准备：",
    ...plan.required.map((item, index) => `${index + 1}. ${item}`),
    "",
    "上线前检查：",
    "1. 域名 HTTPS 能打开，备用入口可复制。",
    "2. 服务端 Secret 不出现在任何 HTML / JS / CSS 文件里。",
    "3. 任务失败有日志、错误原因和返工节点。",
    "4. 积分扣费有流水，失败任务有补偿规则。",
    "5. 资产库能按角色、场景、道具、模板和返工记录检索。",
    "",
    `商用体验入口：${primaryCustomerEntry}`,
    `备用预览：${githubPagesEntry}`,
    `完整体验版：${rootPagesEntry}`
  ].join("\n");
}

function buildExperienceGuideText() {
  return [
    "AI短剧生产主控客户体验步骤",
    "",
      `1. 打开入口：优先打开 ${primaryCustomerEntry}；需要备用访问时再打开 ${githubPagesEntry}。如果微信里打不开，就复制到手机 Chrome / Safari；还不行就打开智能启动页 ${launchPagesEntry} 或访问保障页 ${accessPagesEntry}。`,
    "2. 看创作流程：在首页输入题材并点击生成，先看系统如何拆成剧本、角色、场景、视频提示词和返工诊断节点。",
    "3. 换真实题材：点击页面作品案例，或直接改输入框里的题材，看同一套主控流程如何复用。",
    "4. 看输出结构：确认结果里是否包含输入类型判断、处理范围、调用节点、资产需求、生成方案和返工方向。",
    "5. 进入试点：把素材提交包发给我们，先做 1 个主角、1 个场景、3 条 10 秒竖屏钩子。",
    "",
    "体验版优先保障客户能打开；完整界面当前走云端演示引擎，正式部署后再接真实云端生成、账号、积分和资产库。"
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
    "打开体验：手机能打开商用体验入口；微信打不开时能复制到 Chrome / Safari，仍不行可用访问保障页。",
    "创作结果：点击生成后出现主控结果，不出现空白页。",
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
    `云端模式：${state.cloudGenerationMode || "unknown"}`,
    `API：${apiRouteText.textContent || ""} / ${apiRouteMeta.textContent || ""}`,
    `缓存：${cacheText.textContent || ""} / ${cacheMeta.textContent || ""}`,
    `最近生成：${runMeta.textContent || ""}`,
    `最近请求：${state.lastRun?.requestId || "无"}`,
    `浏览器：${navigator.userAgent}`,
    "",
    "建议：如果微信内打不开，请复制当前入口到手机 Chrome / Safari 打开；仍不行先发访问保障页。如果 API 显示备用演示，把这段诊断报告发给技术排查。"
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
  return window.location.hostname.endsWith("workers.dev") || window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
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
    state.cloudReachable = false;
    state.cloudGenerationMode = "local";
    setServiceStatus("fallback", "稳定演示模式");
    return;
  }

  try {
    const health = await fetchHealth();
    state.cloudReachable = true;
    state.cloudGenerationMode = health.data?.generationMode || "live";
    setServiceStatus("online", state.cloudGenerationMode === "live" ? "真实生成服务在线" : "云端演示引擎在线");
  } catch {
    state.cloudReachable = false;
    state.cloudGenerationMode = "local";
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
      state.cloudReachable = true;
      state.cloudGenerationMode = health.data?.generationMode || "live";
      apiRouteText.textContent = state.cloudGenerationMode === "live" ? "真实生成" : "云端演示";
      apiRouteMeta.textContent = `${apiHost} · ${health.latencyMs}ms · V${health.data?.version || "0.30"}`;
    } catch {
      state.cloudReachable = false;
      state.cloudGenerationMode = "local";
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
  if (!state.cloudReachable && state.serviceStatus !== "online") {
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
  const fallbackWarning = errors[0] || (candidates.length ? "云端生成失败，已切换本页稳定演示结果" : "当前网络无法访问云端演示引擎，已在本页生成稳定演示结果");
  return {
    ok: true,
    degraded: true,
    result: buildDemoResult(payload, fallbackWarning),
    usage: { estimatedPoints: payload.mode === "video" ? 260 : payload.mode === "image" ? 80 : 160 },
    meta: {
      requestId: "local-fallback",
      source: "local-fallback",
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
    const source = data.meta?.source || (data.degraded ? "local-fallback" : "live");
    if (source === "cloud-fallback") {
      state.cloudReachable = true;
      state.cloudGenerationMode = "stable-demo";
      setServiceStatus("online", "云端演示引擎已返回");
      apiRouteText.textContent = "云端演示";
      apiRouteMeta.textContent = "云端通道可用，当前使用稳定演示引擎";
    } else {
      setServiceStatus(data.degraded ? "fallback" : "online", data.degraded ? "备用演示已启用" : "真实生成服务在线");
    }
    const latency = data.meta?.latencyMs ?? Math.round(performance.now() - startedAt);
    const requestId = data.meta?.requestId || "local";
    state.lastRun = {
      requestId,
      latencyMs: latency,
      degraded: Boolean(data.degraded),
      createdAt: new Date().toLocaleString("zh-CN", { hour12: false })
    };
    runMeta.textContent = `${data.degraded ? (source === "cloud-fallback" ? "云端演示" : "备用演示") : "真实生成"} · ${Math.max(1, Math.round(latency / 1000))} 秒 · ${requestId}`;
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

if (modeSelect) {
  modeSelect.addEventListener("change", () => updateMode(modeSelect.value));
}

[ratioSelect, resolutionSelect, durationSelect, modelSelect, promptInput].filter(Boolean).forEach((input) => {
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

copyArchitectureButton.addEventListener("click", async () => {
  copyText(buildArchitectureText(), "架构说明已复制");
});

copyNodeSpecButton.addEventListener("click", async () => {
  copyText(buildNodeSpecText(), "节点方案已复制");
});

[maturitySelect, materialSelect, goalSelect, volumeSelect].forEach((select) => {
  select.addEventListener("change", renderEstimate);
});

[needAccountCheckbox, needPointsCheckbox, needAssetsCheckbox, needBatchCheckbox, needApiLogCheckbox].forEach((checkbox) => {
  checkbox.addEventListener("change", renderEstimate);
});

resetEstimateButton.addEventListener("click", () => {
  maturitySelect.value = "script";
  materialSelect.value = "partial";
  goalSelect.value = "internal";
  volumeSelect.value = "small";
  needAccountCheckbox.checked = false;
  needPointsCheckbox.checked = false;
  needAssetsCheckbox.checked = true;
  needBatchCheckbox.checked = false;
  needApiLogCheckbox.checked = false;
  renderEstimate();
  showToast("评估已重置");
});

copyEstimateButton.addEventListener("click", async () => {
  renderEstimate();
  copyText(buildEstimateReportText(), "评估报告已复制");
});

copyProposalButton.addEventListener("click", async () => {
  renderEstimate();
  copyText(buildEstimateProposalText(), "跟进方案已复制");
});

[deployStageSelect, domainModeSelect, serverModeSelect, usageScaleSelect].forEach((select) => {
  select.addEventListener("change", renderDeployPlan);
});

[deployLoginCheckbox, deployPaymentCheckbox, deployAssetCheckbox, deployBatchCheckbox, deployAuditCheckbox, deployAdminCheckbox].forEach((checkbox) => {
  checkbox.addEventListener("change", renderDeployPlan);
});

resetDeployButton.addEventListener("click", () => {
  deployStageSelect.value = "temporary";
  domainModeSelect.value = "temp";
  serverModeSelect.value = "static";
  usageScaleSelect.value = "solo";
  deployLoginCheckbox.checked = false;
  deployPaymentCheckbox.checked = false;
  deployAssetCheckbox.checked = true;
  deployBatchCheckbox.checked = false;
  deployAuditCheckbox.checked = false;
  deployAdminCheckbox.checked = false;
  renderDeployPlan();
  showToast("部署配置已重置");
});

copyDeployPlanButton.addEventListener("click", async () => {
  renderDeployPlan();
  copyText(buildDeployPlanText(), "部署方案已复制");
});

copyInfraChecklistButton.addEventListener("click", async () => {
  renderDeployPlan();
  copyText(buildInfraChecklistText(), "基础设施清单已复制");
});

copyMobileEntryButton.addEventListener("click", async () => {
  copyText(primaryCustomerEntry, "商用体验入口已复制");
});

openRootEntryButton.addEventListener("click", () => {
  window.open(primaryCustomerEntry, "_blank", "noopener,noreferrer");
});


openMirrorButton.addEventListener("click", () => {
  window.open(emergencyMirrorEntry, "_blank", "noopener,noreferrer");
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

updateMode("image", false);
loadSettings();
renderPoints();
renderCases();
renderAgentNodes();
renderReferenceMenu();
loadHistory();
renderPreviewResult();
renderEstimate();
renderDeployPlan();
checkService();
runAccessDiagnostics();
registerServiceWorker();

